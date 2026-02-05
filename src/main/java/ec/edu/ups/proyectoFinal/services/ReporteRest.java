package ec.edu.ups.proyectoFinal.services;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import java.io.ByteArrayOutputStream;
import java.util.List;

import ec.edu.ups.proyectoFinal.dao.AsesoriaDAO;
import ec.edu.ups.proyectoFinal.model.Asesoria;

@Path("reportes")
public class ReporteRest {

    @Inject
    private AsesoriaDAO asesoriaDAO;

    @GET
    @Path("pdf")
    @Produces("application/pdf")
    public Response descargarPdf() {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // 1. Crear documento
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            // 2. Encabezado
            Font titulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            document.add(new Paragraph("🚀 Reporte Real de Citas - P67", titulo));
            document.add(new Paragraph("Datos desde PostgreSQL\n\n"));
            document.add(new Paragraph("--------------------------------------------------\n"));

            // 3. DATOS REALES
            List<Asesoria> lista = asesoriaDAO.getTodas();

            if (lista.isEmpty()) {
                document.add(new Paragraph("No hay citas registradas."));
            } else {
                for (Asesoria cita : lista) {
                    document.add(new Paragraph("📌 Tema: " + cita.getTema()));
                    document.add(new Paragraph("   Fecha: " + cita.getFecha() + " - Hora: " + cita.getHora()));
                    document.add(new Paragraph("--------------------------------------------------"));
                }
            }

            document.close();
            
            return Response.ok(out.toByteArray())
                    .header("Content-Disposition", "attachment; filename=Reporte_Real.pdf")
                    .build();

        } catch (Exception e) { 
            e.printStackTrace();
            return Response.serverError().build(); 
        }
    }
}