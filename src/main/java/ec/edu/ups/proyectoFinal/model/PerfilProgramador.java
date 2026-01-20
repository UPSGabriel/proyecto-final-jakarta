package ec.edu.ups.proyectoFinal.model;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity @Table(name="TBL_PERFILES")
public class PerfilProgramador implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY) private int id;
    private String especialidad; private String descripcion; private String github; private String whatsapp;
    @OneToOne @JoinColumn(name="usuario_id") private Usuario usuario;
    @OneToMany(mappedBy="programador", cascade=CascadeType.ALL) private List<Disponibilidad> horarios;
    // Getters y Setters...
    public int getId() { return id; } public void setId(int id) { this.id = id; }
    public String getEspecialidad() { return especialidad; } public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }
    public String getDescripcion() { return descripcion; } public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getGithub() { return github; } public void setGithub(String github) { this.github = github; }
    public String getWhatsapp() { return whatsapp; } public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
    public Usuario getUsuario() { return usuario; } public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public List<Disponibilidad> getHorarios() { return horarios; } public void setHorarios(List<Disponibilidad> horarios) { this.horarios = horarios; }
}
