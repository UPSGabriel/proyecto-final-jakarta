from sqlalchemy import Column, Integer, String
from database import Base

class Persona(Base):
    __tablename__ = "personas"


    cedula = Column(String, primary_key=True, index=True)
    nombre = Column(String)
    direccion = Column(String)