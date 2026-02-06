import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProjectsService } from '../../services/projects';
import { AuthService } from '../../auth/auth.service';
import { Proyecto, Asesoria } from '../../models/entidades';

// Importamos Chart.js para el gráfico
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
  private http = inject(HttpClient);
  private router = inject(Router);

  // URLs (Asegúrate de que el puerto sea el correcto, a veces es 8080)
  private readonly JAVA_API = 'https://backend-proyecto-final-ajik.onrender.com/proyectoFinal/api';
  private readonly PYTHON_API = 'http://localhost:8000/notificaciones/enviar';
  private readonly JAVA_USUARIOS = 'https://backend-proyecto-final-ajik.onrender.com/proyectoFinal/api';

  projects: Proyecto[] = [];
  asesorias: Asesoria[] = [];
  currentUser: any = null;
  public chart: any;

  // 👇 VARIABLE PARA EL FORMULARIO DE PERFIL
  miPerfil: any = {
    horarios: '',
    modalidad: 'Virtual',
    especialidad: ''
  };

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

        // 👇 CARGAMOS LOS DATOS DEL PERFIL SI YA EXISTEN
        if (this.currentUser.perfil) {
          // Copiamos los datos para que aparezcan en el formulario
          this.miPerfil = { ...this.currentUser.perfil };
        }
      }
    });
  }

  // 👇 FUNCIÓN PARA GUARDAR EL PERFIL (ESTA FALTABA)
  actualizarPerfil() {
    if (!this.currentUser?.id) return;

    // Preparamos el objeto a enviar
    const payload = {
      ...this.currentUser,
      perfil: this.miPerfil
    };

    // Llamamos al endpoint nuevo que creamos en Java
    this.http.put(`${this.JAVA_USUARIOS}/perfil/${this.currentUser.id}`, payload).subscribe({
      next: (data: any) => {
        alert('✅ ¡Disponibilidad actualizada correctamente!');
        this.currentUser = data; // Actualizamos localmente
      },
      error: (e) => {
        console.error(e);
        alert('❌ Error al actualizar perfil.');
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
          this.renderizarGrafico();
        },
        error: (e) => console.error('❌ Error cargando asesorías:', e)
      });
  }

  renderizarGrafico() {
    const pendientes = this.asesorias.filter(a => a.estado === 'PENDIENTE').length;
    const aceptadas = this.asesorias.filter(a => a.estado === 'ACEPTADA').length;
    const rechazadas = this.asesorias.filter(a => a.estado === 'RECHAZADA').length;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("asesoriasChart", {
      type: 'doughnut',
      data: {
        labels: ['Pendientes', 'Aceptadas', 'Rechazadas'],
        datasets: [{
          data: [pendientes, aceptadas, rechazadas],
          backgroundColor: ['#ff9800', '#2e7d32', '#d32f2f'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Estado de mis Solicitudes' }
        }
      }
    });
  }

  abrirModal(asesoria: Asesoria, tipo: 'ACEPTADA' | 'RECHAZADA') {
    this.selectedAsesoria = asesoria;
    this.accion = tipo;
    this.mensajeRespuesta = '';
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
        alert('⚠️ Se guardó el estado, pero falló el envío del correo.');
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
      alert('⚠️ Nombre y Repo son obligatorios.');
      return;
    }

    this.projectService.create(this.newProject).subscribe({
      next: () => {
        alert('✅ Proyecto guardado');
        this.loadProjects();
        this.resetForm();
      },
      error: () => alert('❌ Error al guardar')
    });
  }

  delete(id: number) {
    if (confirm('¿Eliminar proyecto?')) {
      this.projectService.delete(id).subscribe({
        next: () => this.loadProjects(),
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
