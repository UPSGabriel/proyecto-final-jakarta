package ec.edu.ups.proyectoFinal.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.util.List;
import ec.edu.ups.proyectoFinal.model.Asesoria;
import ec.edu.ups.proyectoFinal.model.Usuario; 

@Stateless
public class AsesoriaDAO {

    @PersistenceContext
    private EntityManager em;

    public void insert(Asesoria asesoria) {
        if (asesoria.getCliente() != null) {
            int idCliente = asesoria.getCliente().getId();
            Usuario clienteReal = em.find(Usuario.class, idCliente);
            asesoria.setCliente(clienteReal); 
        }

        if (asesoria.getProgramador() != null) {
            int idProg = asesoria.getProgramador().getId();
            Usuario programadorReal = em.find(Usuario.class, idProg);
            asesoria.setProgramador(programadorReal); 
        }

        em.persist(asesoria);
    }

    public void update(Asesoria asesoria) {
        em.merge(asesoria);
    }
    

    public Asesoria read(int id) {
        return em.find(Asesoria.class, id);
    }

    public List<Asesoria> getTodas() {
        return em.createQuery("SELECT a FROM Asesoria a", Asesoria.class).getResultList();
    }

    public List<Asesoria> getPorProgramador(int programadorId) {
        String jpql = "SELECT a FROM Asesoria a WHERE a.programador.id = :pid";
        Query query = em.createQuery(jpql, Asesoria.class);
        query.setParameter("pid", programadorId);
        return query.getResultList();
    }

    public List<Asesoria> getPorCliente(int clienteId) {
        String jpql = "SELECT a FROM Asesoria a WHERE a.cliente.id = :cid";
        Query query = em.createQuery(jpql, Asesoria.class);
        query.setParameter("cid", clienteId);
        return query.getResultList();
    }
 
    public List<Asesoria> getCitasFuturas() {
    	
        return em.createQuery("SELECT a FROM Asesoria a WHERE a.estado = 'ACEPTADA'", Asesoria.class)
                 .getResultList();
    }
}