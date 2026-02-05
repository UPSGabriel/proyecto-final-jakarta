from sqlalchemy.orm import Session
from . import models, schemas

class PersonaRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_all(self):
        return self.db.query(models.Persona).all()

    def find_by_cedula(self, cedula: str):
        return self.db.query(models.Persona).filter(models.Persona.cedula == cedula).first()

    def save(self, persona: models.Persona):
        self.db.add(persona)
        self.db.commit()
        self.db.refresh(persona)
        return persona

    def delete(self, persona: models.Persona):
        self.db.delete(persona)
        self.db.commit()