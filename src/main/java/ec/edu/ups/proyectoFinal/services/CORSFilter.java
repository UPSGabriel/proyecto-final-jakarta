package ec.edu.ups.proyectoFinal.services;

import java.io.IOException;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter; // NUEVO
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.container.PreMatching; // IMPORTANTE
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

@Provider
@PreMatching // <--- ESTA ETIQUETA ES LA CLAVE
public class CORSFilter implements ContainerRequestFilter, ContainerResponseFilter {

    /**
     * FILTRO DE ENTRADA (Request):
     * Detecta si el navegador está preguntando permisos (OPTIONS) y responde "OK" de inmediato.
     */
    @Override
    public void filter(ContainerRequestContext request) throws IOException {
        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            request.abortWith(Response.ok().build());
        }
    }

    /**
     * FILTRO DE SALIDA (Response):
     * Pone los sellos de permiso en todas las respuestas que salen del servidor.
     */
    @Override
    public void filter(ContainerRequestContext request, ContainerResponseContext response) throws IOException {
        response.getHeaders().add("Access-Control-Allow-Origin", "*");
        response.getHeaders().add("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");
        response.getHeaders().add("Access-Control-Allow-Credentials", "true");
        response.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
    }
}