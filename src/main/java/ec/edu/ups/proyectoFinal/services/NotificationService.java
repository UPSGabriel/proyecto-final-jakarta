package ec.edu.ups.proyectoFinal.services;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.*;
import jakarta.mail.*;
import jakarta.mail.internet.*;
import java.util.Properties;


import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Singleton
@Startup
public class NotificationService {
  

	private final String emailUser = "alexgabo9080@gmail.com"; 
    
    
    private final String emailPass = "gkfhqqkgafhoaiui";

    public static final String ACCOUNT_SID = "ACf7cd538ace210f4ceb5f1baf5aea49f5"; 
    public static final String AUTH_TOKEN = "2640b1aada5afeace8ed60fda11fd3d9"; 
 
    public static final String TWILIO_NUMBER = "whatsapp:+14155238886"; 

    @PostConstruct
    public void init() {
        
        try {
           
            if (!ACCOUNT_SID.equals("AC_TU_SID_AQUI")) {
                Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
                System.out.println("✅ Servicio de Twilio Inicializado Correctamente.");
            } else {
                System.out.println("⚠️ Twilio no configurado: Faltan credenciales reales.");
            }
        } catch (Exception e) {
            System.err.println("❌ Error al iniciar Twilio: " + e.getMessage());
        }
    }

    @Schedule(hour="*", minute="0", persistent=false)
    public void tareaProgramada() {
        System.out.println("[SCHEDULER] Verificando citas próximas...");
    }


    public void enviarCorreo(String to, String subject, String body) {
        Properties prop = new Properties();
        prop.put("mail.smtp.host", "smtp.gmail.com"); 
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.auth", "true"); 
        prop.put("mail.smtp.starttls.enable", "true");
        
        Session session = Session.getInstance(prop, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() { 
                return new PasswordAuthentication(emailUser, emailPass); 
            }
        });
        
        try {
            jakarta.mail.Message msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(emailUser));
            msg.setRecipients(jakarta.mail.Message.RecipientType.TO, InternetAddress.parse(to));
            msg.setSubject(subject); 
            msg.setText(body);
            Transport.send(msg);
            System.out.println("📧 Correo enviado a: " + to);
        } catch (Exception e) { 
            e.printStackTrace(); 
        }
    }

   
    public void enviarWhatsapp(String numeroDestino, String mensaje) {
        try {
            
            
            Message message = Message.creator(
                new PhoneNumber("whatsapp:" + numeroDestino), 
                new PhoneNumber(TWILIO_NUMBER),            
                mensaje                                     
            ).create();

            System.out.println("📱 WhatsApp enviado con éxito! SID: " + message.getSid());

        } catch (Exception e) {
            System.err.println("❌ Error enviando WhatsApp: " + e.getMessage());
            
        }
    }
}