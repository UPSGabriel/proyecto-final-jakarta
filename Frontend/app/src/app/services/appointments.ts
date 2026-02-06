import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asesoria } from '../models/entidades';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private http = inject(HttpClient);
  

  private readonly API_URL = 'https://backend-proyecto-final-ajik.onrender.com/asesorias';


  getAll(): Observable<Asesoria[]> {
    return this.http.get<Asesoria[]>(this.API_URL);
  }

  getMyAppointments(): Observable<Asesoria[]> {
    return this.http.get<Asesoria[]>(`${this.API_URL}/mis-citas`); 
  }

  create(appointment: Partial<Asesoria>): Observable<any> {
    return this.http.post(this.API_URL, appointment);
  }

  update(appointment: Asesoria): Observable<any> {
    return this.http.put(this.API_URL, appointment);
  }
}