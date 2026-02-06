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
@RequestMapping("/api/stats") 
@CrossOrigin(origins = "*") 
public class DashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/resumen") 
    public Map<String, Object> verMetricas() {
        Map<String, Object> data = new HashMap<>();
        
        try {
            
            String sqlUsers = "SELECT id, nombre, email FROM tbl_usuarios"; 
            List<Map<String, Object>> listaUsuarios = jdbcTemplate.queryForList(sqlUsers);
            
            
            String sqlProjects = "SELECT id, nombre, descripcion FROM tbl_proyectos";
            List<Map<String, Object>> listaProyectos = jdbcTemplate.queryForList(sqlProjects);
            
        
            data.put("totalUsuarios", listaUsuarios.size());     
            data.put("cantidad_usuarios", listaUsuarios.size()); 
            
            data.put("proyectosActivos", listaProyectos.size()); 
            
            
            data.put("lista_usuarios", listaUsuarios); 
            data.put("status", "OK");
            
        } catch (Exception e) {
            data.put("error", "Error consultando DB: " + e.getMessage());
            data.put("status", "ERROR");
            e.printStackTrace(); 
        }
        
        return data;
    }
}