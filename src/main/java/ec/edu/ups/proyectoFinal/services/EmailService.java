package ec.edu.ups.proyectoFinal.services;

import jakarta.ejb.Stateless;

@Stateless
public class EmailService {

    public void enviarCorreo(String destinatario, String asunto, String cuerpo) {
        // 👇 SIMULACIÓN PROFESIONAL DE JAVAMAIL
        System.out.println("\n========== 📨 INICIANDO SERVICIO DE CORREO (SIMULADO) ==========");
        System.out.println("🔌 [EmailService] Conectando a servidor SMTP: smtp.gmail.com:587...");
        System.out.println("🔐 [EmailService] Autenticando credenciales (TLS)... OK");
        System.out.println("📤 [EmailService] Preparando mensaje MimeMessage...");
        System.out.println("   ➡ TO: " + destinatario);
        System.out.println("   ➡ SUBJECT: " + asunto);
        System.out.println("   ➡ BODY: " + cuerpo);
        
       
        try { Thread.sleep(500); } catch (InterruptedException e) {}

        System.out.println("✅ [EmailService] 250 OK: Correo entregado exitosamente.");
        System.out.println("=================================================================\n");
    }
}