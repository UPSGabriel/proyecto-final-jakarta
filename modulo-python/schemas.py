
from pydantic import BaseModel
from typing import Optional



class PersonaBase(BaseModel):
    cedula: str
    nombre: str
    direccion: str



class PersonaCreate(PersonaBase):
    pass


class PersonaUpdate(BaseModel):
    cedula: Optional[str] = None
    nombre: Optional[str] = None
    direccion: Optional[str] = None


class Persona(PersonaBase):
    

    class Config:
        from_attributes = True