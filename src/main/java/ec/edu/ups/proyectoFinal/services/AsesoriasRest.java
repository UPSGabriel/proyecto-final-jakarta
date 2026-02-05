package ec.edu.ups.proyectoFinal.services;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import ec.edu.ups.proyectoFinal.dao.AsesoriaDAO;
import ec.edu.ups.proyectoFinal.model.Asesoria;

@Path("/asesorias")
public class AsesoriasRest {

    @Inject
    private AsesoriaDAO asesoriaDAO;
    
    @PersistenceContext
    private EntityManager em;
    

    @GET
    @Path("/programador/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPorProgramador(@PathParam("id") int programadorId) {
        try {
           
            String jpql = "SELECT a FROM Asesoria a WHERE a.programador.id = :pid";
            List<Asesoria> lista = em.createQuery(jpql, Asesoria.class)
                                     .setParameter("pid", programadorId)
                                     .getResultList();
            return Response.ok(lista).build();
        } catch (Exception e) {
            return Response.status(500).entity("Error cargando citas").build();
        }
    }
    
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response actualizarEstado(Asesoria asesoria) {
        try {
            System.out.println("🔄 Actualizando asesoría ID: " + asesoria.getId());
            asesoriaDAO.update(asesoria); 
            return Response.ok(asesoria).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity("Error actualizando").build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response crearCita(Asesoria asesoria) {
        try {
            System.out.println("✅ Java: Guardando cita en Postgres...");
            asesoriaDAO.insert(asesoria);

            
            System.out.println("📞 Java: Preparando datos para Python...");
            
            String jsonPython = "{"
                    + "\"email\": [\"alexgabo9080@gmail.com\"],"  
                    + "\"asunto\": \"Confirmación de Cita - Dúo Trend\","
                    + "\"mensaje\": \"Hola, confirmamos que tu cita para el tema: " + asesoria.getTema() + " ha sido agendada correctamente.\""
                    + "}";

            llamarPython(jsonPython);
            

            return Response.ok("{\"mensaje\": \"¡Cita guardada y correo enviado!\"}").build();

        } catch (Exception e) {
            e.printStackTrace();
            
            return Response.status(500).entity("{\"error\": \"Error procesando solicitud: " + e.getMessage() + "\"}").build();
        }
    }

   
    private void llamarPython(String jsonInputString) {
        try {
            
            URL url = new URL("http://127.0.0.1:8000/notificaciones/enviar"); 
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json; utf-8");
            con.setDoOutput(true);

            
            try (OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

         
            int code = con.getResponseCode();
            System.out.println("🐍 Respuesta de Python (FastAPI): " + code);

        } catch (Exception e) {
            System.out.println("⚠️ Error conectando con Python: " + e.getMessage());
            System.out.println("Asegúrate de ejecutar: uvicorn main:app --reload");
        }
    }
}