from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Indica onde o arquivo do banco de dados será criado
SQLALCHEMY_DATABASE_URL = "sqlite:///./matchrate.db"

# Cria o motor do banco de dados
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Cria uma fábrica de sessões (para podermos abrir e fechar conexões com o banco)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe base que usaremos para criar as tabelas depois
Base = declarative_base()

# Função utilitária que o FastAPI vai usar para abrir e fechar o banco a cada requisição
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()