from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, get_db
import models, schemas
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
import os
import httpx
from dotenv import load_dotenv
load_dotenv()
from auth import hash_senha, verificar_senha, criar_token, get_usuario_atual
from fastapi.security import OAuth2PasswordRequestForm
import json
from datetime import datetime


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://matchrate.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

@app.post("/api/v1/avaliacoes/", response_model=schemas.AvaliacaoResponse)
def salvar_avaliacao(avaliacao: schemas.AvaliacaoCreate, db: Session = Depends(get_db)):
    nova = models.Avaliacao(**avaliacao.model_dump())
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova

@app.get("/api/v1/avaliacoes/{jogo_id}/media")
def obter_media(jogo_id: int, db: Session = Depends(get_db)):
    resultado = db.query(
        func.avg(models.Avaliacao.nota),
        func.count(models.Avaliacao.id)
    ).filter(models.Avaliacao.id_jogo == jogo_id).first()

    if not resultado[0]:
        return {"media": 0, "total_votos": 0}

    return {"media": round(resultado[0], 1), "total_votos": resultado[1]}

@app.get("/api/v1/jogos/ranking")
def ranking(db: Session = Depends(get_db)):
    resultado = db.query(
        models.Avaliacao.id_jogo,
        func.avg(models.Avaliacao.nota).label("media"),
        func.count(models.Avaliacao.id).label("total_votos")
    ).group_by(models.Avaliacao.id_jogo).order_by(func.avg(models.Avaliacao.nota).desc()).all()

    return [{"id_jogo": r.id_jogo, "media": round(r.media, 1), "total_votos": r.total_votos} for r in resultado]



@app.get("/api/v1/jogos")
async def listar_jogos():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.football-data.org/v4/competitions/WC/matches?season=2026",
                headers={"X-Auth-Token": os.environ.get("FOOTBALL_KEY")},
                timeout=10.0
            )
            
            if response.status_code != 200:
                return {"erro": f"API externa retornou {response.status_code}"}
            
            return response.json()
    except Exception as e:
        return {"erro": str(e)}
    
@app.get("/api/v1/tabela")
async def obter_tabela():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.football-data.org/v4/competitions/WC/standings",
            headers={"X-Auth-Token": os.environ.get("FOOTBALL_KEY")}
        )
        return response.json()


@app.post("/api/v1/palpites/")
def salvar_palpite(palpite: dict, db: Session = Depends(get_db)):
    novo = models.Palpite(**palpite)
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo


@app.post("/api/v1/auth/cadastro")
def cadastro(dados: dict, db: Session = Depends(get_db)):
    if db.query(models.Usuario).filter(models.Usuario.email == dados["email"]).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    usuario = models.Usuario(
        nome=dados["nome"],
        email=dados["email"],
        senha_hash=hash_senha(dados["senha"])
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return {"id": usuario.id, "nome": usuario.nome, "email": usuario.email}

@app.post("/api/v1/auth/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == form.username).first()
    if not usuario or not verificar_senha(form.password, usuario.senha_hash):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    token = criar_token({"sub": usuario.email})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/v1/auth/me")
def me(usuario = Depends(get_usuario_atual)):
    return {"id": usuario.id, "nome": usuario.nome, "email": usuario.email}

@app.post("/api/v1/simulacoes/")
def salvar_simulacao(dados: dict, db: Session = Depends(get_db), usuario = Depends(get_usuario_atual)):
    # Verifica se já tem simulação salva e atualiza
    existente = db.query(models.Simulacao).filter(models.Simulacao.usuario_id == usuario.id).first()
    if existente:
        existente.campeao_nome = dados["campeao_nome"]
        existente.campeao_flag = dados.get("campeao_flag", "")
        existente.semi = json.dumps(dados.get("semi", []))
        existente.quartas = json.dumps(dados.get("quartas", []))
        existente.oitavas = json.dumps(dados.get("oitavas", []))
        existente.criado_em = datetime.utcnow()
        db.commit()
        return {"ok": True}
    nova = models.Simulacao(
        usuario_id=usuario.id,
        campeao_nome=dados["campeao_nome"],
        campeao_flag=dados.get("campeao_flag", ""),
        semi=json.dumps(dados.get("semi", [])),
        quartas=json.dumps(dados.get("quartas", [])),
        oitavas=json.dumps(dados.get("oitavas", []))
    )
    db.add(nova)
    db.commit()
    return {"ok": True}

@app.get("/api/v1/simulacoes/me")
def minha_simulacao(db: Session = Depends(get_db), usuario = Depends(get_usuario_atual)):
    sim = db.query(models.Simulacao).filter(models.Simulacao.usuario_id == usuario.id).first()
    if not sim:
        return None
    return {
        "campeao_nome": sim.campeao_nome,
        "campeao_flag": sim.campeao_flag,
        "semi": json.loads(sim.semi or "[]"),
        "quartas": json.loads(sim.quartas or "[]"),
        "oitavas": json.loads(sim.oitavas or "[]"),
        "criado_em": sim.criado_em
    }

@app.head("/")
def health_check_head():
    return {"status": "online"}

@app.get("/api/v1/palpites/me")
def meus_palpites(db: Session = Depends(get_db), usuario = Depends(get_usuario_atual)):
    return db.query(models.Palpite).filter(models.Palpite.id_usuario == usuario.id).all()

@app.get("/api/v1/simulacoes/ranking")
def ranking_campeoes(db: Session = Depends(get_db)):
    resultado = db.query(
        models.Simulacao.campeao_nome,
        func.max(models.Simulacao.campeao_flag).label("campeao_flag"),
        func.count(models.Simulacao.id).label("total")
    ).group_by(models.Simulacao.campeao_nome).order_by(func.count(models.Simulacao.id).desc()).all()

    total_geral = db.query(func.count(models.Simulacao.id)).scalar() or 1

    return [
        {
            "campeao": r.campeao_nome,
            "flag": r.campeao_flag,
            "total": r.total,
            "percentual": round((r.total / total_geral) * 100, 1)
        }
        for r in resultado
    ]


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)