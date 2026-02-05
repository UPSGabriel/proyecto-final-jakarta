package ec.edu.ups.proyectoFinal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "tbl_asesorias") // Asegúrate de que coincida con tu tabla en PgAdmin
public class Asesoria implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String tema;
    private String fecha; // Usamos String para evitar líos de formatos por ahora
    private String hora;
    private String estado;

    // --- GETTERS Y SETTERS OBLIGATORIOS ---
    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTema() { return tema; }
    public void setTema(String tema) { this.tema = tema; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public String getHora() { return hora; }
    public void setHora(String hora) { this.hora = hora; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}