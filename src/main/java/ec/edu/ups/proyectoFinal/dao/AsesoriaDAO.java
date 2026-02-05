package ec.edu.ups.proyectoFinal.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ec.edu.ups.proyectoFinal.model.Asesoria;

@Stateless // ¡Importante para que funcione la inyección!
public class AsesoriaDAO {

    @PersistenceContext
    private EntityManager em;

    public void insert(Asesoria asesoria) {
        em.persist(asesoria);
    }
    
   
 // Pegar esto dentro de AsesoriaDAO, antes del final }
    public java.util.List<Asesoria> getTodas() {
        return em.createQuery("SELECT a FROM Asesoria a", Asesoria.class).getResultList();
    }
    
    // Puedes agregar más métodos aquí (update, read, etc) si los necesitas después
}