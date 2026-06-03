from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
import models

SECRET_KEY = "matchrate2026copasecret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def hash_senha(senha: str) -> str:
    return bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verificar_senha(senha: str, hash: str) -> bool:
    return bcrypt.checkpw(senha.encode('utf-8'), hash.encode('utf-8'))

def criar_token(data: dict):
    dados = data.copy()
    dados["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)

def get_usuario_atual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    usuario = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    return usuario