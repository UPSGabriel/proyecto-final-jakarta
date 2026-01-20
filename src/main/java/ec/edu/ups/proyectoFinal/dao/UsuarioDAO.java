package ec.edu.ups.proyectoFinal.dao;
import ec.edu.ups.proyectoFinal.model.Usuario;
import jakarta.ejb.Stateless;
import jakarta.persistence.*;
import java.util.List;

@Stateless
public class UsuarioDAO {
    @PersistenceContext private EntityManager em;
    public void insert(Usuario u) { em.persist(u); }
    public void update(Usuario u) { em.merge(u); }
    public void delete(int id) { em.remove(em.find(Usuario.class, id)); }
    public List<Usuario> getAll() { return em.createQuery("SELECT u FROM Usuario u", Usuario.class).getResultList(); }
    public Usuario login(String email, String pass) {
        try { return em.createQuery("SELECT u FROM Usuario u WHERE u.email=:e AND u.password=:p", Usuario.class)
                     .setParameter("e", email).setParameter("p", pass).getSingleResult();
        } catch(Exception e) { return null; }
    }
}
