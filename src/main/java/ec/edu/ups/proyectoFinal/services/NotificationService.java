package ec.edu.ups.proyectoFinal.services;
import jakarta.ejb.*;
import jakarta.mail.*;
import jakarta.mail.internet.*;
import java.util.Properties;

@Singleton @Startup
public class NotificationService {
    // CAMBIA ESTO CON TU GMAIL Y CLAVE DE APLICACION
    private final String username = "tucorreo@gmail.com"; 
    private final String password = "clave_de_aplicacion"; 

    @Schedule(hour="*", minute="0", persistent=false)
    public void tareaProgramada() {
        System.out.println("⏰ [SCHEDULER] Verificando citas próximas...");
    }

    public void enviarCorreo(String to, String subject, String body) {
        Properties prop = new Properties();
        prop.put("mail.smtp.host", "smtp.gmail.com"); prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.auth", "true"); prop.put("mail.smtp.starttls.enable", "true");
        Session session = Session.getInstance(prop, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() { return new PasswordAuthentication(username, password); }
        });
        try {
            Message msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(username));
            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            msg.setSubject(subject); msg.setText(body);
            Transport.send(msg);
        } catch (Exception e) { e.printStackTrace(); }
    }
}
