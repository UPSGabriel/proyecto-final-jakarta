package ec.edu.ups.proyectoFinal.model;
import jakarta.persistence.*;
import java.io.Serializable;

@Entity @Table(name="TBL_USUARIOS")
public class Usuario implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nombre;
    @Column(unique=true) private String email;
    private String password;
    private String rol; 
    
 // ... otros atributos (email, password, etc) ...

    @OneToOne(mappedBy = "usuario", fetch = FetchType.EAGER) // EAGER = "Traeme el perfil AHORA MISMO"
    private Perfil perfil;

   
    public Perfil getPerfil() { return perfil; }
    public void setPerfil(Perfil perfil) { this.perfil = perfil; }
    public int getId() { return id; } public void setId(int id) { this.id = id; }
    public String getNombre() { return nombre; } public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; } public void setPassword(String password) { this.password = password; }
    public String getRol() { return rol; } public void setRol(String rol) { this.rol = rol; }
}
