package ec.edu.ups.proyectoFinal.model;
import jakarta.persistence.*;
import java.io.Serializable;
@Entity @Table(name="TBL_PROYECTOS")
public class Proyecto implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY) private int id;
    private String nombre; private String descripcion; private String seccion; private String urlRepo; private String tecnologias;
    @ManyToOne private Usuario usuario;
    
    public int getId() { return id; } public void setId(int id) { this.id = id; }
    public String getNombre() { return nombre; } public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; } public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getSeccion() { return seccion; } public void setSeccion(String seccion) { this.seccion = seccion; }
    public String getUrlRepo() { return urlRepo; } public void setUrlRepo(String urlRepo) { this.urlRepo = urlRepo; }
    public String getTecnologias() { return tecnologias; } public void setTecnologias(String tecnologias) { this.tecnologias = tecnologias; }
    public Usuario getUsuario() { return usuario; } public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
