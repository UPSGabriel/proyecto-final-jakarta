package ec.edu.ups.proyectoFinal.services;
import ec.edu.ups.proyectoFinal.dao.UsuarioDAO;
import ec.edu.ups.proyectoFinal.model.LoginResponse;
import ec.edu.ups.proyectoFinal.model.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import java.util.Date;

@Path("auth")
public class AuthRest {
	
	@Inject
	private NotificationService notificaciones;
	
	@Inject
    private UsuarioDAO dao;

	public void registrarUsuario(Usuario u) {
	
	    notificaciones.enviarWhatsapp("+593987654321", "¡Hola " + u.getNombre() + "! Bienvenido a Dúo Trend 🚀");
	}
	@POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(Usuario credenciales) {
        
        Usuario u = dao.login(credenciales.getEmail(), credenciales.getPassword());
        
        if (u != null) {
            
            LoginResponse res = new LoginResponse(
                u.getId(), 
                u.getNombre(), 
                u.getEmail(), 
                u.getRol(), 
                "token-generado-" + u.getId()
            );
            return Response.ok(res).build();
        } else {
            return Response.status(401).entity("{\"error\": \"No autorizado\"}").build();
        }
    }
}