from sqlalchemy import Column, Integer, String
# OJO: Asegúrate de importar Base desde tu archivo database
from database import Base

class Persona(Base):
    __tablename__ = "personas"

    # La llave primaria es la cédula según tu proyecto
    cedula = Column(String, primary_key=True, index=True)
    nombre = Column(String)
    direccion = Column(String)