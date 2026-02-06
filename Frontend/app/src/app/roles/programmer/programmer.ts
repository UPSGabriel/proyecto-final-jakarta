import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProjectsService } from '../../services/projects';
import { AuthService } from '../../auth/auth.service';
import { Proyecto, Asesoria } from '../../models/entidades';
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
  private http = inject(HttpClient); // 👈 Nuevo
  private router = inject(Router);   // 👈 Nuevo


  private readonly JAVA_API = 'https://backend-proyecto-final-ajik.onrender.com/proyectoFinal/api/asesorias';
  private readonly PYTHON_API = 'https://backend-python-upxt.onrender.com/notificaciones/enviar';


  projects: Proyecto[] = [];
  asesorias: Asesoria[] = []; // 👈 Lista de citas
  currentUser: any = null;


  newProject: Proyecto = {
    nombre: '',
    descripcion: '',
    seccion: 'Academico',
    urlRepo: '',
    tecnologias: ''
  };


  isModalOpen = false;
  selectedAsesoria: Asesoria | null = null;
  accion: 'ACEPTADA' | 'RECHAZADA' = 'ACEPTADA';
  mensajeRespuesta = '';
  isProcessing = false;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;


      if (this.currentUser && !this.currentUser.id) {
        console.error('⚠️ Usuario corrupto detectado (Sin ID). Cerrando sesión...');
        this.logout();
        return;
      }

      if (this.currentUser) {
        this.loadProjects();
        this.loadAsesorias();
      }
    });
  }



  loadAsesorias() {
    if (!this.currentUser?.id) return;


    this.http.get<Asesoria[]>(`${this.JAVA_API}/programador/${this.currentUser.id}`)
      .subscribe({
        next: (data) => {
          this.asesorias = data;

          this.asesorias.sort((a, b) => a.estado === 'PENDIENTE' ? -1 : 1);
        },
        error: (e) => console.error('❌ Error cargando asesorías:', e)
      });
  }

  abrirModal(asesoria: Asesoria, tipo: 'ACEPTADA' | 'RECHAZADA') {
    this.selectedAsesoria = asesoria;
    this.accion = tipo;
    this.mensajeRespuesta = ''; // Limpiamos el mensaje anterior
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.selectedAsesoria = null;
    this.isProcessing = false;
  }

  confirmarAccion() {
    if (!this.selectedAsesoria) return;
    this.isProcessing = true;


    const asesoriaUpdate: Asesoria = {
      ...this.selectedAsesoria,
      estado: this.accion,
      respuesta: this.mensajeRespuesta
    };


    this.http.put(this.JAVA_API, asesoriaUpdate).subscribe({
      next: () => {
        console.log('✅ Estado actualizado en Java');

        this.enviarCorreoCliente(asesoriaUpdate);
      },
      error: (e) => {
        console.error(e);
        alert('❌ Error al guardar en la base de datos.');
        this.isProcessing = false;
      }
    });
  }

  enviarCorreoCliente(asesoria: Asesoria) {

    if (!asesoria.cliente?.email) {
      alert('✅ Estado guardado, pero no se envió correo (Cliente sin email).');
      this.cerrarModal();
      this.loadAsesorias();
      return;
    }

    const asunto = `Actualización de Asesoría: ${this.accion}`;
    const cuerpo = `Hola ${asesoria.cliente.nombre},\n\n` +
      `El programador ${this.currentUser.nombre} ha respondido a tu solicitud sobre "${asesoria.tema}".\n\n` +
      `🔹 Estado: ${this.accion}\n` +
      `📝 Mensaje: ${this.mensajeRespuesta}\n\n` +
      `Atentamente,\nEquipo Dúo Trend.`;

    const payload = {
      email: [asesoria.cliente.email],
      asunto: asunto,
      mensaje: cuerpo
    };


    this.http.post(this.PYTHON_API, payload).subscribe({
      next: () => {
        alert(`✅ Asesoría ${this.accion} y correo enviado al cliente.`);
        this.cerrarModal();
        this.loadAsesorias();
      },
      error: (err) => {
        console.error('Error Python:', err);
        alert('⚠️ Se guardó el estado en el sistema, pero falló el envío del correo.');
        this.cerrarModal();
        this.loadAsesorias();
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
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
