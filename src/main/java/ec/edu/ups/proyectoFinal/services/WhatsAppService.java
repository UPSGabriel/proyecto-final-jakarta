package ec.edu.ups.proyectoFinal.services;
import jakarta.ejb.Stateless;
@Stateless
public class WhatsAppService {
    public void enviar(String numero, String msj) {
        System.out.println("📱 [WHATSAPP SIMULADO] A: " + numero + " | Msj: " + msj);
    }
}
