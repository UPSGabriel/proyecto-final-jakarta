package ec.edu.ups.proyectoFinal.dao;

import ec.edu.ups.proyectoFinal.model.Usuario;
import jakarta.ejb.Stateless;
import jakarta.persistence.*;
import java.util.List;

@Stateless
public class UsuarioDAO {

    @PersistenceContext 
    private EntityManager em;

    public void insert(Usuario u) { 
       
        if (u.getPerfil() != null) {
            u.getPerfil().setUsuario(u);
        }
        em.persist(u); 
    }

    public void update(Usuario u) {
        if (u.getPerfil() != null) {
            u.getPerfil().setUsuario(u);
        }
        em.merge(u); 
    }

    public void delete(int id) { 
        Usuario u = em.find(Usuario.class, id);
        if (u != null) {
            em.remove(u); 
        }
    }

    public List<Usuario> getAll() { 
        
        String jpql = "SELECT u FROM Usuario u LEFT JOIN FETCH u.perfil";
        return em.createQuery(jpql, Usuario.class).getResultList(); 
    }

    public Usuario login(String email, String password) {
        try {
            
            String jpql = "SELECT u FROM Usuario u LEFT JOIN FETCH u.perfil WHERE u.email = :email AND u.password = :password";
            
            return em.createQuery(jpql, Usuario.class)
                     .setParameter("email", email)
                     .setParameter("password", password)
                     .getSingleResult();
        } catch (NoResultException e) {
            return null; 
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
