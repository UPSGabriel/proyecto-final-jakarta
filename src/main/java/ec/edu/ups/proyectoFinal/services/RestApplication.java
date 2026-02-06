package ec.edu.ups.proyectoFinal.services;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.eclipse.microprofile.openapi.annotations.info.Contact;
import org.eclipse.microprofile.openapi.annotations.info.Info;

@OpenAPIDefinition(
    info = @Info(
        title = "API Dúo Trend - Proyecto Final P67",
        version = "1.0.0",
        description = "API RESTful para la gestión de Portafolios, Usuarios y Asesorías.",
        contact = @Contact(
            name = "Gabriel y Daniel",
            email = "gabriel@ups.edu.ec",
            url = "https://duotrend.com"
        )
    )
)
@ApplicationPath("/api")
public class RestApplication extends Application {
    // No hace falta poner nada aquí dentro
}