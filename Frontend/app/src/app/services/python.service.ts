import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PythonService {

  private pythonUrl = 'https://backend-python-upxt.onrender.com';

  constructor(private http: HttpClient) { }


  descargarExcel(): Observable<Blob> {
    return this.http.get(`${this.pythonUrl}/reportes/descargar-excel`, {
      responseType: 'blob'
    });
  }


  enviarCorreo(destinatario: string, asunto: string, mensaje: string): Observable<any> {
    const body = {
      email: [destinatario],
      asunto: asunto,
      mensaje: mensaje
    };
    return this.http.post(`${this.pythonUrl}/notificaciones/enviar`, body);
  }
}
