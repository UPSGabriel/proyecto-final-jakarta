package ec.edu.ups.proyectoFinal.model;

import java.io.Serializable;

public class LoginResponse implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int id;
    private String nombre;
    private String email;
    private String rol;
    private String token;

    public LoginResponse(int id, String nombre, String email, String rol, String token) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.token = token;
    }

 
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
