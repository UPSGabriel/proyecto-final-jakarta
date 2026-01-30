# Archivo: schemas.py
from pydantic import BaseModel
from typing import Optional


# 1. Esquema Base (Lo que tienen en común todas las operaciones)
class PersonaBase(BaseModel):
    cedula: str
    nombre: str
    direccion: str


# 2. Esquema para CREAR (Hereda de Base)
# Sirve para validar cuando mandas un POST
class PersonaCreate(PersonaBase):
    pass


# 3. Esquema para ACTUALIZAR (Campos opcionales)
# Sirve para PATCH o PUT, por si solo quieres cambiar el nombre
class PersonaUpdate(BaseModel):
    cedula: Optional[str] = None
    nombre: Optional[str] = None
    direccion: Optional[str] = None


# 4. Esquema para LEER (Lo que devuelve la API)
# Este es importante: 'from_attributes = True' permite leer datos de SQLAlchemy
class Persona(PersonaBase):
    # Aquí podrías agregar un campo 'id' si tu tabla lo tiene
    # id: int

    class Config:
        from_attributes = True