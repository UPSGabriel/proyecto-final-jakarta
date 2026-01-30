from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import pandas as pd
from io import BytesIO
from database import engine
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr, BaseModel
from typing import List
from sqlalchemy import text

# 1. Crear la aplicación
app = FastAPI()


# 2. Ruta de Prueba (Para ver que el servidor corre)
@app.get("/")
def read_root():
    return {"mensaje": "Backend en Python conectado con Éxito 🚀"}


# --- MÓDULO DE REPORTES (EXCEL) ---
# Este es el endpoint que busca el navegador
@app.get("/reportes/descargar-excel")
def descargar_excel():
    # A. Definimos la consulta SQL
    # Usamos 'tbl_usuarios' para traer los datos reales de tu proyecto
    query = "SELECT * FROM tbl_usuarios"

    try:
        # B. Pandas ejecuta la consulta y guarda en memoria
        df = pd.read_sql(query, engine)

        # C. Creamos un archivo Excel en memoria (buffer)
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Lista_Usuarios')

        output.seek(0)

        # D. Preparamos los encabezados para la descarga
        headers = {
            "Content-Disposition": "attachment; filename=reporte_usuarios_sistema.xlsx"
        }

        # E. Devolvemos el archivo directamente al navegador
        return StreamingResponse(
            output,
            headers=headers,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
    except Exception as e:
        return {"error": f"Hubo un problema generando el Excel: {str(e)}"}


# --- CONFIGURACIÓN DE EMAIL ---
# Reemplaza con TUS datos reales
conf = ConnectionConfig(
    MAIL_USERNAME="alexgabo9080@gmail.com",
    MAIL_PASSWORD="gkfhqqkgafhoaiui",
    MAIL_FROM="alexgabo9080@gmail.com",
    MAIL_PORT=465,  # Cambiamos de 587 a 465
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=False,  # Apagamos STARTTLS
    MAIL_SSL_TLS=True,  # Encendemos SSL directo
    # -------------------
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True

)


# Modelo de datos para recibir la petición
class EmailSchema(BaseModel):
    email: List[EmailStr]  # Lista de correos destinatarios
    asunto: str
    mensaje: str


# --- ENDPOINT PARA ENVIAR CORREO ---
@app.post("/notificaciones/enviar")
async def enviar_correo(email_data: EmailSchema):
    html = f"""
    <h3>Notificación del Sistema de Asesorías</h3>
    <p>{email_data.mensaje}</p>
    <br>
    <p>Atentamente,<br>El equipo de Dúo Trend / Proyecto Integrador</p>
    """

    message = MessageSchema(
        subject=email_data.asunto,
        recipients=email_data.email,
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        return {"mensaje": "Correo enviado correctamente 📧"}
    except Exception as e:
        return {"error": f"Falló el envío: {str(e)}"}