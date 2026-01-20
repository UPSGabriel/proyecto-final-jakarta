package ec.edu.ups.proyectoFinal.dao;

import ec.edu.ups.proyectoFinal.model.Proyecto;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;

@Stateless
public class ProyectoDAO {

    @PersistenceContext
    private EntityManager em;

    public void insert(Proyecto proyecto) {
        em.persist(proyecto);
    }

  
    public void update(Proyecto proyecto) {
        em.merge(proyecto);
    }

  
    public Proyecto read(int id) {
        return em.find(Proyecto.class, id);
    }

   
    public void delete(int id) {
        Proyecto p = read(id);
        if (p != null) {
            em.remove(p);
        }
    }

 
    public List<Proyecto> getAll() {
        String jpql = "SELECT p FROM Proyecto p";
        return em.createQuery(jpql, Proyecto.class).getResultList();
    }

  
    public List<Proyecto> getPorUsuario(int usuarioId) {
        String jpql = "SELECT p FROM Proyecto p WHERE p.usuario.id = :uid";
        return em.createQuery(jpql, Proyecto.class)
                 .setParameter("uid", usuarioId)
                 .getResultList();
    }
}
