package ec.edu.ups.proyectoFinal.model;
import jakarta.persistence.*;
import java.io.Serializable;
@Entity @Table(name="TBL_DISPONIBILIDAD")
public class Disponibilidad implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY) private int id;
    private String dia; private String horaInicio; private String horaFin;
    @ManyToOne private PerfilProgramador programador;
  
    public int getId() { return id; } public void setId(int id) { this.id = id; }
    public String getDia() { return dia; } public void setDia(String dia) { this.dia = dia; }
    public String getHoraInicio() { return horaInicio; } public void setHoraInicio(String horaInicio) { this.horaInicio = horaInicio; }
    public String getHoraFin() { return horaFin; } public void setHoraFin(String horaFin) { this.horaFin = horaFin; }
    public PerfilProgramador getProgramador() { return programador; } public void setProgramador(PerfilProgramador programador) { this.programador = programador; }
}