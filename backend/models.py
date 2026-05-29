from sqlalchemy import Column, Integer, Float, DateTime, String
from datetime import datetime
from database import Base

class Avaliacao(Base):
    __tablename__ = "avaliacoes"

    id = Column(Integer, primary_key=True, index=True)
    id_jogo = Column(Integer, index=True)
    nota = Column(Float)
    comentario = Column(String)
    criado_em = Column(DateTime, default=datetime.utcnow)

class Palpite(Base):
    __tablename__ = "palpites"

    id = Column(Integer, primary_key=True, index=True)
    id_jogo = Column(Integer, index=True)
    gol_casa = Column(Integer)
    gol_fora = Column(Integer)
    criado_em = Column(DateTime, default=datetime.utcnow)