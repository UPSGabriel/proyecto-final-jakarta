package ec.edu.ups.proyectoFinal.services;
import ec.edu.ups.proyectoFinal.model.Proyecto;
import ec.edu.ups.proyectoFinal.dao.ProyectoDAO; 
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("proyectos")
public class ProyectosRest {
    @Inject private ProyectoDAO dao;
    @GET @Produces(MediaType.APPLICATION_JSON)
    public List<Proyecto> list() { return dao.getAll(); }
    @POST @Consumes(MediaType.APPLICATION_JSON)
    public String save(Proyecto p) { dao.insert(p); return "{\"msg\":\"ok\"}"; }
    @DELETE @Path("/{id}")
    public String delete(@PathParam("id") int id) { dao.delete(id); return "{\"msg\":\"ok\"}"; }
}
