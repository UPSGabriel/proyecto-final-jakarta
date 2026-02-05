from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import pandas as pd
from io import BytesIO
from database import engine
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr, BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def read_root():
    return {"mensaje": "Backend en Python conectado con Éxito 🚀"}



@app.get("/reportes/descargar-excel")
def descargar_excel():

    query = "SELECT * FROM tbl_usuarios"

    try:

        df = pd.read_sql(query, engine)


        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Lista_Usuarios')

        output.seek(0)


        headers = {
            "Content-Disposition": "attachment; filename=reporte_usuarios_sistema.xlsx"
        }


        return StreamingResponse(
            output,
            headers=headers,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
    except Exception as e:
        return {"error": f"Hubo un problema generando el Excel: {str(e)}"}



conf = ConnectionConfig(
    MAIL_USERNAME="alexgabo9080@gmail.com",
    MAIL_PASSWORD="gkfhqqkgafhoaiui",
    MAIL_FROM="alexgabo9080@gmail.com",
    MAIL_PORT=465,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,

    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True



)



class EmailSchema(BaseModel):
    email: List[EmailStr]
    asunto: str
    mensaje: str



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