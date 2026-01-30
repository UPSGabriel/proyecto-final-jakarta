from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# --- CONFIGURACIÓN DE LA CONEXIÓN ---
# Formato: postgresql://USUARIO:CONTRASEÑA@LOCALHOST:PUERTO/NOMBRE_DB
# CAMBIA '1234' por TU contraseña de Postgres
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:odoo@localhost:5432/proyecto_final_db"

# 1. Crear el motor (Engine) que abre la conexión
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 2. Crear la sesión (SessionLocal) para manejar transacciones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Crear la Base para los Modelos (Esto lo usarás en models.py)
Base = declarative_base()

# 4. Función de utilidad para obtener la DB (Dependency Injection)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()