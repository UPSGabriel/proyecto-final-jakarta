package ec.edu.ups.proyectoFinal.services;

import ec.edu.ups.proyectoFinal.dao.UsuarioDAO;
import ec.edu.ups.proyectoFinal.model.Usuario;
import ec.edu.ups.proyectoFinal.model.Perfil; // 👈 ESTE IMPORT FALTABA
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager; // 👈 Importante
import jakarta.persistence.PersistenceContext; // 👈 Importante
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.Date;
import java.util.List;

@Path("usuarios")
@Tag(name = "Gestión de Usuarios", description = "Operaciones CRUD y Autenticación")
public class UsuariosRest {

    @Inject
    private UsuarioDAO dao;
    
    @PersistenceContext // 👈 Usamos esto por seguridad
    private EntityManager em;
    
    @Inject
    private NotificationService notificaciones;
    
    public void registrarUsuario(Usuario u) {
        notificaciones.enviarWhatsapp("+593987654321", "¡Hola " + u.getNombre() + "! Bienvenido a Dúo Trend 🚀");
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(summary = "Listar todos los usuarios", description = "Devuelve la lista completa.")
    public Response getUsuarios() {
        try {
            List<Usuario> usuarios = dao.getAll();
            return Response.ok(usuarios).build();
        } catch (Exception e) {
            return Response.status(500).entity("Error al listar: " + e.getMessage()).build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(summary = "Crear nuevo usuario", description = "Registra un usuario.")
    public Response createUsuario(Usuario u) {
        try {
            dao.insert(u);
            if (u.getRol().equalsIgnoreCase("CLIENTE")) {
                registrarUsuario(u); 
            }
            return Response.ok("{\"message\":\"Usuario creado exitosamente\"}").build();
        } catch (Exception e) {
            return Response.status(500).entity("Error al crear: " + e.getMessage()).build();
        }
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(summary = "Actualizar usuario", description = "Modifica datos básicos.")
    public Response updateUsuario(Usuario u) {
        try {
            dao.update(u);
            return Response.ok("{\"message\":\"Usuario actualizado\"}").build();
        } catch (Exception e) {
            return Response.status(500).entity("Error al actualizar").build();
        }
    }
    
    @DELETE
    @Path("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Borra un usuario por ID.")
    public Response deleteUsuario(@PathParam("id") int id) {
        try {
            dao.delete(id);
            return Response.ok("{\"message\":\"Usuario eliminado\"}").build();
        } catch (Exception e) {
            return Response.status(500).entity("Error al eliminar").build();
        }
    }
    
    @GET
    @Path("programadores")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProgramadores() {
        try {
            List<Usuario> usuarios = dao.getAll(); 
            List<Usuario> programadores = usuarios.stream()
                .filter(u -> "PROGRAMADOR".equalsIgnoreCase(u.getRol()))
                .toList();
            return Response.ok(programadores).build();
        } catch (Exception e) {
            return Response.status(500).entity("Error").build();
        }
    }
    
    @POST 
    @Path("login") 
    @Consumes(MediaType.APPLICATION_JSON) 
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(Usuario u) {
        Usuario user = dao.login(u.getEmail(), u.getPassword());
        
        if(user != null) {
            String token = Jwts.builder().setSubject(user.getEmail()).claim("rol", user.getRol())
                .setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256)).compact();
            
            String jsonRespuesta = "{"
                + "\"token\":\"" + token + "\","
                + "\"rol\":\"" + user.getRol() + "\","
                + "\"id\":" + user.getId() + ","
                + "\"nombre\":\"" + user.getNombre() + "\""
                + "}";
                
            return Response.ok(jsonRespuesta).build();
        }
        return Response.status(401).entity("{\"error\":\"Credenciales inválidas\"}").build();
    }

    // 👇 MÉTODO ACTUALIZADO: Usa 'em.find' para evitar errores del DAO
    @PUT
    @Path("/perfil/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(summary = "Actualizar Perfil Programador", description = "Actualiza horarios y modalidad.")
    public Response actualizarPerfil(@PathParam("id") int id, Usuario usuarioDatos) {
        try {
            System.out.println("🔄 Actualizando perfil del usuario ID: " + id);
            
           
            Usuario usuarioReal = em.find(Usuario.class, id);
            
            if (usuarioReal == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }

            if (usuarioReal.getPerfil() == null) {
                usuarioReal.setPerfil(new Perfil());
            }

            if (usuarioDatos.getPerfil() != null) {
                usuarioReal.getPerfil().setHorarios(usuarioDatos.getPerfil().getHorarios());
                usuarioReal.getPerfil().setModalidad(usuarioDatos.getPerfil().getModalidad());
                usuarioReal.getPerfil().setEspecialidad(usuarioDatos.getPerfil().getEspecialidad());
            }

            
            dao.update(usuarioReal);
            
            return Response.ok(usuarioReal).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity("Error actualizando perfil").build();
        }
    }
}