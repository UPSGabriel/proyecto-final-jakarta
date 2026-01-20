import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto } from '../models/entidades'; 
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private http = inject(HttpClient);
  

  private readonly API_URL = 'http://localhost:8080/proyectoFinal/api/proyectos';


  getAll(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.API_URL);
  }


  create(project: Proyecto): Observable<any> {
    return this.http.post(this.API_URL, project);
  }


  update(project: Proyecto): Observable<any> {
  
    return this.http.put(this.API_URL, project);
  }


  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}