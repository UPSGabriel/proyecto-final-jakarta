package ec.edu.ups.reportes.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*") 
public class DashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/metricas")
    public Map<String, Object> verMetricas() {
        Map<String, Object> data = new HashMap<>();
        
        try {
            // 1. TRAER LA LISTA DE USUARIOS REALES
          
            String sqlUsers = "SELECT id, nombre, email FROM tbl_usuarios"; 
            List<Map<String, Object>> listaUsuarios = jdbcTemplate.queryForList(sqlUsers);
            
            // 2. TRAER LA LISTA DE PROYECTOS REALES
            String sqlProjects = "SELECT id, nombre, descripcion FROM tbl_proyectos";
            List<Map<String, Object>> listaProyectos = jdbcTemplate.queryForList(sqlProjects);
            
            // 3. Armar la respuesta JSON Completa
            data.put("cantidad_usuarios", listaUsuarios.size());
            data.put("lista_usuarios", listaUsuarios); //
            
            data.put("cantidad_proyectos", listaProyectos.size());
            data.put("lista_proyectos", listaProyectos); 
            
            data.put("mensaje", "Datos detallados desde PostgreSQL compartido");
            data.put("status", "OK");
            
        } catch (Exception e) {
            data.put("error", "Error consultando DB: " + e.getMessage());
            data.put("status", "ERROR");
        }
        
        return data;
    }
}