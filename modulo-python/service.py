from sqlalchemy.orm import Session
# Importamos el Repositorio (asegúrate de que tu archivo se llame repository.py)
from repository import PersonaRepository
import models, schemas


class PersonaService:
    def __init__(self, db: Session):
        # Conectamos con el repositorio que maneja la base de datos
        self.repo = PersonaRepository(db)

    def get_all(self):
        # Obtener todas las personas
        return self.repo.find_all()

    def get_by_cedula(self, cedula: str):
        # Buscar una persona por su cédula
        return self.repo.find_by_cedula(cedula)

    def create(self, persona_data: schemas.PersonaCreate):
        # Crear una nueva persona
        # Aquí convertimos los datos del esquema a un modelo de base de datos
        persona = models.Persona(**persona_data.model_dump())
        return self.repo.save(persona)

    def update(self, cedula: str, persona_data: schemas.PersonaUpdate):
        # Actualizar datos de una persona existente
        db_persona = self.repo.find_by_cedula(cedula)
        if not db_persona:
            return None

        # Actualizamos solo los campos que vienen con datos
        update_data = persona_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_persona, key, value)

        return self.repo.save(db_persona)

    def delete(self, cedula: str):
        # Eliminar una persona
        db_persona = self.repo.find_by_cedula(cedula)
        if db_persona:
            self.repo.delete(db_persona)
            return True
        return False