package ec.edu.ups.proyectoFinal.model;
import jakarta.persistence.*;
import java.io.Serializable;
@Entity @Table(name="TBL_ASESORIAS")
public class Asesoria implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY) private int id;
    private String tema; private String fecha; private String hora; private String estado; private String respuesta;
    @ManyToOne private Usuario cliente; @ManyToOne private Usuario programador;
    
    
    public int getId() { return id; } public void setId(int id) { this.id = id; }
    public String getTema() { return tema; } public void setTema(String tema) { this.tema = tema; }
    public String getFecha() { return fecha; } public void setFecha(String fecha) { this.fecha = fecha; }
    public String getHora() { return hora; } public void setHora(String hora) { this.hora = hora; }
    public String getEstado() { return estado; } public void setEstado(String estado) { this.estado = estado; }
    public String getRespuesta() { return respuesta; } public void setRespuesta(String respuesta) { this.respuesta = respuesta; }
    public Usuario getCliente() { return cliente; } public void setCliente(Usuario cliente) { this.cliente = cliente; }
    public Usuario getProgramador() { return programador; } public void setProgramador(Usuario programador) { this.programador = programador; }
}