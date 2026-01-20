package ec.edu.ups.proyectoFinal.model;
import jakarta.persistence.*;
import java.io.Serializable;

@Entity
public class Disponibilidad implements Serializable {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    private String dia; // Lunes, Martes...
    private String horaInicio;
    private String horaFin;
    
    @ManyToOne
    private Usuario programador;
    
    // Getters y Setters...
}