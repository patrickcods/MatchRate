from pydantic import BaseModel
from typing import Optional

class AvaliacaoCreate(BaseModel):
    nota: float
    comentario: Optional[str] = None 
    id_jogo: int       

class AvaliacaoResponse(AvaliacaoCreate):
    id: int
    
    class Config:
        from_attributes = True