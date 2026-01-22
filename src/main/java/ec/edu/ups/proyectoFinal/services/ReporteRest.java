package ec.edu.ups.proyectoFinal.services;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import java.io.ByteArrayOutputStream;

@Path("reportes")
public class ReporteRest {

    @GET
    @Path("pdf")
    @Produces("application/pdf")
    public Response descargarPdf() {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();
            document.add(new Paragraph("Reporte de Asesorías - P67"));
            document.add(new Paragraph("--------------------------------"));
            document.add(new Paragraph("1. Cita Pendiente - Juan Perez"));
            document.close();
            
            return Response.ok(out.toByteArray())
                    .header("Content-Disposition", "attachment; filename=reporte.pdf")
                    .build();
        } catch (Exception e) { return Response.serverError().build(); }
    }
}