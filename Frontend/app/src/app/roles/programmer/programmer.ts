import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../services/projects'; // Asegúrate que la ruta sea correcta
import { AuthService } from '../../auth/auth.service';
import { Proyecto } from '../../models/entidades';

@Component({
  selector: 'app-programmer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './programmer.html',
  styleUrls: ['./programmer.scss']
})
export class ProgrammerComponent implements OnInit {

  private projectService = inject(ProjectsService);
  private authService = inject(AuthService);


  projects: Proyecto[] = [];
  currentUser: any = null;

  newProject: Proyecto = {
    nombre: '',
    descripcion: '',
    seccion: 'Academico', 
    urlRepo: '',
    tecnologias: ''
  };

  ngOnInit() {

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadProjects();
  }


  loadProjects() {
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (e) => console.error('Error al cargar proyectos:', e)
    });
  }


  save() {

    if (!this.newProject.nombre || !this.newProject.urlRepo) {
      alert('⚠️ El nombre y la URL del repositorio son obligatorios.');
      return;
    }

    this.projectService.create(this.newProject).subscribe({
      next: () => {
        alert('✅ Proyecto guardado exitosamente');
        this.loadProjects(); 
        this.resetForm();    
      },
      error: () => alert('❌ Error al guardar el proyecto')
    });
  }


  delete(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      this.projectService.delete(id).subscribe({
        next: () => {
          this.loadProjects(); 
        },
        error: () => alert('❌ Error al eliminar')
      });
    }
  }

  resetForm() {
    this.newProject = {
      nombre: '',
      descripcion: '',
      seccion: 'Academico',
      urlRepo: '',
      tecnologias: ''
    };
  }
}