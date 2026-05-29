from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, get_db
import models, schemas
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
import os
import httpx
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))


@app.get("/api/v1/jogos")
async def listar_jogos():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.football-data.org/v4/competitions/WC/matches?season=2026",
                headers={"X-Auth-Token": os.environ.get("FOOTBALL_KEY")}
            )
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