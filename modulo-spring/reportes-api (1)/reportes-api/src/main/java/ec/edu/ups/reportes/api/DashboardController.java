package ec.edu.ups.reportes.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*") // Permite que Angular consuma estos datos sin bloqueos
public class DashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/metricas")
    public Map<String, Object> verMetricas() {
        Map<String, Object> data = new HashMap<>();
        
        try {
            // --- CORRECCIÓN IMPORTANTE ---
            // Apuntamos a las tablas que creó Jakarta (empiezan con tbl_)
            
            // 1. Contar usuarios reales (Tabla generada por Jakarta)
            String sqlUsers = "SELECT COUNT(*) FROM tbl_usuarios"; 
            Integer totalUsuarios = jdbcTemplate.queryForObject(sqlUsers, Integer.class);
            
            // 2. Contar proyectos reales (Tabla generada por Jakarta)
            // Nota: Si en tu base se llama 'tbl_proyecto' (singular), quítale la 's'. 
            // Pero por lo general Jakarta usa plurales o lo que definiste en @Table.
            String sqlProyectos = "SELECT COUNT(*) FROM tbl_proyectos";
            Integer totalProyectos = jdbcTemplate.queryForObject(sqlProyectos, Integer.class);
            
            // 3. Armar la respuesta
            data.put("total_usuarios", totalUsuarios);
            data.put("total_proyectos", totalProyectos);
            data.put("mensaje", "Datos sincronizados con Jakarta EE");
            data.put("status", "OK");
            
        } catch (Exception e) {
            // Si falla, es probable que Jakarta aún no haya insertado datos en tbl_usuarios
            data.put("error", "Error consultando DB: " + e.getMessage());
            data.put("total_usuarios", 0);
            data.put("total_proyectos", 0);
            data.put("status", "SIN_DATOS");
        }
        
        return data;
    }
}