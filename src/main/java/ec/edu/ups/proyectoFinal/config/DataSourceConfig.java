package ec.edu.ups.proyectoFinal.config; // Ajusta el paquete si es necesario

import jakarta.annotation.sql.DataSourceDefinition;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;

@Singleton
@Startup
@DataSourceDefinition(
    name = "java:app/jdbc/ProyectoDS",   // Nombre clave para el persistence.xml
    className = "org.postgresql.ds.PGSimpleDataSource",
    user = "postgres",
    password = "odoo", // <--- ¡OJO CAMBIA ESTO!
    databaseName = "proyecto_final_db",  // La misma que creamos para Spring Boot
    serverName = "localhost",
    portNumber = 5432
)
public class DataSourceConfig {
    // Esta clase está vacía, solo sirve para que la anotación configure la BD al arrancar.
}