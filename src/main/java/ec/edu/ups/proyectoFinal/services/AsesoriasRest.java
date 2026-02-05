package ec.edu.ups.proyectoFinal.services;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

import ec.edu.ups.proyectoFinal.dao.AsesoriaDAO;
import ec.edu.ups.proyectoFinal.model.Asesoria;

@Path("/asesorias")
public class AsesoriasRest {

    @Inject
    private AsesoriaDAO asesoriaDAO;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response crearCita(Asesoria asesoria) {
        try {
            System.out.println("✅ Java: Guardando cita en Postgres...");
            asesoriaDAO.insert(asesoria);

            // --- AQUÍ LLAMAMOS A PYTHON ---
            System.out.println("📞 Java: Preparando datos para Python...");
            
            // CONSTRUIMOS EL JSON EXACTO QUE PIDE TU MAIN.PY
            // Nota: "email" va entre corchetes [] porque Python espera una lista.
            String jsonPython = "{"
                    + "\"email\": [\"alexgabo9080@gmail.com\"],"  // <--- CAMBIA ESTO POR TU CORREO REAL SI QUIERES VERLO LLEGAR
                    + "\"asunto\": \"Confirmación de Cita - Dúo Trend\","
                    + "\"mensaje\": \"Hola, confirmamos que tu cita para el tema: " + asesoria.getTema() + " ha sido agendada correctamente.\""
                    + "}";

            llamarPython(jsonPython);
            // ------------------------------

            return Response.ok("{\"mensaje\": \"¡Cita guardada y correo enviado!\"}").build();

        } catch (Exception e) {
            e.printStackTrace();
            // Si falla el correo o la base, avisamos, pero intentamos no romper todo
            return Response.status(500).entity("{\"error\": \"Error procesando solicitud: " + e.getMessage() + "\"}").build();
        }
    }

    // Método auxiliar para conectar con FastAPI
    private void llamarPython(String jsonInputString) {
        try {
            // Apuntamos a tu endpoint de notificaciones
            URL url = new URL("http://127.0.0.1:8000/notificaciones/enviar"); 
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json; utf-8");
            con.setDoOutput(true);

            // Enviamos el JSON
            try (OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            // Leemos la respuesta de Python (200 es OK)
            int code = con.getResponseCode();
            System.out.println("🐍 Respuesta de Python (FastAPI): " + code);

        } catch (Exception e) {
            System.out.println("⚠️ Error conectando con Python: " + e.getMessage());
            System.out.println("Asegúrate de ejecutar: uvicorn main:app --reload");
        }
    }
}