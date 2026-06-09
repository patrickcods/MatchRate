from sqlalchemy import Column, Integer, Float, DateTime, String, Text, ForeignKey
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
    id_usuario = Column(Integer, ForeignKey("usuarios.id"), index=True)
    id_jogo = Column(Integer, index=True)
    jogo_nome = Column(String)
    gol_casa = Column(Integer)
    gol_fora = Column(Integer)
    criado_em = Column(DateTime, default=datetime.utcnow)

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow)

class Simulacao(Base):
    __tablename__ = "simulacoes"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), index=True)
    campeao_nome = Column(String, nullable=False)
    campeao_flag = Column(String)
    semi = Column(Text)
    quartas = Column(Text)
    oitavas = Column(Text)
    criado_em = Column(DateTime, default=datetime.utcnow)