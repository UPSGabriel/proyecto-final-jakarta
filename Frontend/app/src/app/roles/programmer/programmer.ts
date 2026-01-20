import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../models/entidades';


@Component({
  selector: 'app-programmer', standalone: true, imports: [FormsModule, CommonModule],
  templateUrl: './programmer.html', styleUrls: ['./programmer.scss']
})
export class ProgrammerComponent implements OnInit {
  http = inject(HttpClient);
  api = 'http://localhost:8080/proyectoFinal/api/proyectos';
  projects: Proyecto[] = [];
  newProject: Proyecto = { nombre:'', descripcion:'', seccion:'Academico', urlRepo:'', tecnologias:'' };

  ngOnInit() { this.load(); }

  load() { this.http.get<Proyecto[]>(this.api).subscribe(data => this.projects = data); }

  save() {
    this.http.post(this.api, this.newProject).subscribe(() => {
      alert('Guardado en MySQL');
      this.load();
      this.newProject = { nombre:'', descripcion:'', seccion:'Academico', urlRepo:'', tecnologias:'' };
    });
  }

  delete(id: number) {
    if(confirm('¿Borrar?')) this.http.delete(`${this.api}/${id}`).subscribe(() => this.load());
  }
}