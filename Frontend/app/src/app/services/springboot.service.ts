import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpringBootService {
  private http = inject(HttpClient);
  

  private readonly SPRING_API = 'https://deploy-springboot-mdjr.onrender.com/api/stats';

  getEstadisticas(): Observable<any> {
    return this.http.get(`${this.SPRING_API}/resumen`);
  }
}