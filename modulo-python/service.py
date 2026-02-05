from sqlalchemy.orm import Session
from repository import PersonaRepository
import models, schemas


class PersonaService:
    def __init__(self, db: Session):
        self.repo = PersonaRepository(db)

    def get_all(self):
        return self.repo.find_all()

    def get_by_cedula(self, cedula: str):
        return self.repo.find_by_cedula(cedula)

    def create(self, persona_data: schemas.PersonaCreate):
        persona = models.Persona(**persona_data.model_dump())
        return self.repo.save(persona)

    def update(self, cedula: str, persona_data: schemas.PersonaUpdate):
        db_persona = self.repo.find_by_cedula(cedula)
        if not db_persona:
            return None

        update_data = persona_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_persona, key, value)

        return self.repo.save(db_persona)

    def delete(self, cedula: str):
        db_persona = self.repo.find_by_cedula(cedula)
        if db_persona:
            self.repo.delete(db_persona)
            return True
        return False