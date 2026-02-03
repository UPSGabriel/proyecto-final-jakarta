package ec.edu.ups.proyectoFinal.services;
import ec.edu.ups.proyectoFinal.dao.UsuarioDAO;
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

	public void registrarUsuario(Usuario u) {
	
	    notificaciones.enviarWhatsapp("+593987654321", "¡Hola " + u.getNombre() + "! Bienvenido a Dúo Trend 🚀");
	}
    @Inject private UsuarioDAO dao;
    @POST @Path("login") @Consumes(MediaType.APPLICATION_JSON) @Produces(MediaType.APPLICATION_JSON)
    public Response login(Usuario u) {
        Usuario user = dao.login(u.getEmail(), u.getPassword());
        if(user != null) {
            String token = Jwts.builder().setSubject(user.getEmail()).claim("rol", user.getRol())
                .setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256)).compact();
            return Response.ok("{\"token\":\""+token+"\", \"rol\":\""+user.getRol()+"\"}").build();
        }
        return Response.status(401).build();
    }
}