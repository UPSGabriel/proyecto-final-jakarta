import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario, Asesoria } from '../models/entidades';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private http = inject(HttpClient);
  

  private readonly API_URL = 'http://localhost:8080/proyectoFinal/api';


  getProgramadores(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/usuarios`).pipe(
      map(usuarios => usuarios.filter(u => u.rol === 'PROGRAMADOR'))
    );
  }


  agendarCita(cita: Partial<Asesoria>): Observable<any> {
    return this.http.post(`${this.API_URL}/asesorias`, cita);
  }
  getReportePdfUrl(): string {
    return `${this.API_URL}/reportes/pdf`;
  }
}
