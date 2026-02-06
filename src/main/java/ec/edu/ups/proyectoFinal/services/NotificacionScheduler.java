package ec.edu.ups.proyectoFinal.services;

import jakarta.ejb.Schedule;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.inject.Inject;
import ec.edu.ups.proyectoFinal.dao.AsesoriaDAO;
import ec.edu.ups.proyectoFinal.model.Asesoria;
import java.util.List;

@Singleton
@Startup
public class NotificacionScheduler {

    @Inject
    private AsesoriaDAO dao;

    @Inject
    private EmailService emailService; 

    
    @Schedule(hour = "*", minute = "*/1", second = "0", persistent = false)
    public void verificarCitasProximas() {
        System.out.println("⏰ [SCHEDULER] Verificando agenda...");

        try {
            
            List<Asesoria> citas = dao.getCitasFuturas();

            if (citas.isEmpty()) {
                System.out.println("📭 No hay citas pendientes de recordatorio.");
            } else {
                for (Asesoria cita : citas) {
                    // 👇 AQUÍ LLAMAMOS A LA INTEGRACIÓN SIMULADA
                    String emailCliente = cita.getCliente().getEmail();
                    String asunto = "🔔 Recordatorio: Asesoría Dúo Trend";
                    String mensaje = "Hola " + cita.getCliente().getNombre() + 
                                   ", recuerda tu cita de " + cita.getTema() + " para hoy.";

                    emailService.enviarCorreo(emailCliente, asunto, mensaje);
                }
            }
        } catch (Exception e) {
            System.out.println("⚠️ Error en scheduler: " + e.getMessage());
        }
    }
}