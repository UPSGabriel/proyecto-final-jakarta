import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/entidades';
import { SpringBootService } from '../../services/springboot.service';
import { PythonService } from '../../services/python.service';
import { Router } from '@angular/router';

// 👇 1. Importar Chart.js
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent implements OnInit {

  private http = inject(HttpClient);
  private springService = inject(SpringBootService);
  private pythonService = inject(PythonService);
  private router = inject(Router);

  private readonly JAKARTA_API = 'https://backend-proyecto-final-ajik.onrender.com/proyectoFinal/api/usuarios';
  private readonly PYTHON_API = 'https://backend-python-upxt.onrender.com/notificaciones/enviar';

  // Endpoints para los gráficos
  private readonly API_ASESORIAS = 'https://backend-proyecto-final-ajik.onrender.com/proyectoFinal/api'; // Ajustar si es necesario
  private readonly API_PROYECTOS = 'https://backend-proyecto-final-ajik.onrender.com/proyectoFinal/api';

  users: Usuario[] = [];
  statsData: any = null;

  // 👇 Variables para Gráficos
  public chart1: any;
  public chart2: any;

  selectedUser: Usuario = this.getEmptyUser();
  isModalOpen = false;
  isNewUser = true;

  nuevoHorario: string = '';
  horariosList: string[] = [];

  showEmailModal = false;
  isEnviando = false;
  emailData = { destinatario: '', asunto: '', mensaje: '' };

  ngOnInit() {
    this.loadUsersFromJakarta();
    this.loadStatsFromSpringBoot();
    this.cargarDatosDashboard(); // 👇 Cargar gráficos
  }

  // 👇 LÓGICA DEL DASHBOARD (GRÁFICOS)
  cargarDatosDashboard() {
    // 1. Obtener Asesorías para el Gráfico de Barras
    // Nota: Usamos el endpoint que devuelve TODAS las asesorías
    // Si no tienes uno específico "todas", usa el genérico.
    this.http.get<any[]>('https://backend-proyecto-final-ajik.onrender.com/proyectoFinal/api').subscribe({
      next: (asesorias) => {
        this.generarGraficoProgramadores(asesorias);
      },
      error: () => console.warn('No se pudieron cargar asesorías para el gráfico.')
    });

    // 2. Obtener Proyectos para el Gráfico de Pastel
    this.http.get<any[]>(this.API_PROYECTOS).subscribe({
      next: (proyectos) => {
        this.generarGraficoProyectos(proyectos);
      },
      error: () => console.warn('No se pudieron cargar proyectos para el gráfico.')
    });
  }

  generarGraficoProgramadores(asesorias: any[]) {
    // Agrupar conteo por nombre de programador
    const conteo: any = {};
    asesorias.forEach(a => {
      const nombre = a.programador?.nombre || 'Desconocido';
      conteo[nombre] = (conteo[nombre] || 0) + 1;
    });

    const labels = Object.keys(conteo);
    const data = Object.values(conteo);

    if (this.chart1) this.chart1.destroy();

    this.chart1 = new Chart("chartProgramadores", {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total de Citas',
          data: data,
          backgroundColor: '#1565c0',
          borderRadius: 5
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  generarGraficoProyectos(proyectos: any[]) {
    // Agrupar por sección (Academico, Laboral, etc.)
    const conteo: any = {};
    proyectos.forEach(p => {
      const secc = p.seccion || 'Otros';
      conteo[secc] = (conteo[secc] || 0) + 1;
    });

    const labels = Object.keys(conteo);
    const data = Object.values(conteo);

    if (this.chart2) this.chart2.destroy();

    this.chart2 = new Chart("chartProyectos", {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#ff9800', '#4caf50', '#9c27b0', '#f44336']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
  // 👆 FIN LÓGICA DASHBOARD

  loadStatsFromSpringBoot() {
    this.springService.getEstadisticas().subscribe({
      next: (data) => {
        this.statsData = data;
      },
      error: (e) => {
        console.warn('⚠️ No se pudo conectar con Spring Boot (Puerto 8081).');
        this.statsData = null;
      }
    });
  }

  loadUsersFromJakarta() {
    this.http.get<Usuario[]>(this.JAKARTA_API).subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (e) => console.error('❌ Error cargando usuarios de Jakarta:', e)
    });
  }

  agregarHorario() {
    const horarioLimpio = this.nuevoHorario.trim();
    if (!horarioLimpio) return;
    const existe = this.horariosList.includes(horarioLimpio);
    if (existe) {
      alert(`⚠️ El horario "${horarioLimpio}" ya está registrado.`);
      return;
    }
    this.horariosList.push(horarioLimpio);
    this.nuevoHorario = '';
  }

  eliminarHorario(index: number) {
    this.horariosList.splice(index, 1);
  }

  saveUser() {
    if (!this.selectedUser.nombre || !this.selectedUser.email || !this.selectedUser.rol) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    if (this.selectedUser.rol === 'PROGRAMADOR') {
      if (!this.selectedUser.perfil) {
        this.selectedUser.perfil = {
          descripcion: '', especialidad: '', github: '', whatsapp: '', horarios: ''
        };
      }
      this.selectedUser.perfil.horarios = this.horariosList.join(',');
    } else {
      this.selectedUser.perfil = undefined;
    }

    if (this.isNewUser) {
      this.http.post(this.JAKARTA_API, this.selectedUser).subscribe({
        next: () => {
          alert('Usuario creado correctamente en Jakarta ✅');
          this.closeModal();
          this.loadUsersFromJakarta();
        },
        error: () => alert('Error al crear usuario.')
      });
    } else {
      this.http.put(this.JAKARTA_API, this.selectedUser).subscribe({
        next: () => {
          alert('Usuario actualizado en Jakarta ✅');
          this.closeModal();
          this.loadUsersFromJakarta();
        },
        error: () => alert('Error al actualizar usuario.')
      });
    }
  }

  deleteUser(user: Usuario) {
    if (!user.id) return;
    if (confirm(`¿Estás seguro de eliminar a ${user.nombre}?`)) {
      this.http.delete(`${this.JAKARTA_API}/${user.id}`).subscribe({
        next: () => {
          this.loadUsersFromJakarta();
        },
        error: () => alert('Error al eliminar usuario.')
      });
    }
  }

  descargarReporte() {
    this.pythonService.descargarExcel().subscribe({
      next: (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Reporte_Usuarios_DuoTrend.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        alert('Error al conectar con Python para descargar el reporte.');
      }
    });
  }

  abrirModalCorreo() {
    this.emailData = { destinatario: '', asunto: '', mensaje: '' };
    this.showEmailModal = true;
  }

  cerrarModalCorreo() {
    this.showEmailModal = false;
  }

  enviarCorreoPython() {
    this.isEnviando = true;
    const payload = {
      email: [this.emailData.destinatario],
      asunto: this.emailData.asunto,
      mensaje: this.emailData.mensaje
    };

    this.http.post(this.PYTHON_API, payload).subscribe({
      next: (res) => {
        alert('✅ ¡Correo enviado con éxito!');
        this.isEnviando = false;
        this.cerrarModalCorreo();
      },
      error: (err) => {
        alert('❌ Error al enviar. Revisa que Python (Puerto 8000) esté encendido.');
        this.isEnviando = false;
      }
    });
  }

  openCreateModal() {
    this.isNewUser = true;
    this.selectedUser = this.getEmptyUser();
    this.horariosList = [];
    this.isModalOpen = true;
  }

  openEditModal(user: Usuario) {
    this.isNewUser = false;
    this.selectedUser = { ...user };

    if (!this.selectedUser.perfil) {
      this.selectedUser.perfil = { descripcion: '', especialidad: '', github: '', whatsapp: '', horarios: '' };
      this.horariosList = [];
    } else {
      this.horariosList = this.selectedUser.perfil.horarios
        ? this.selectedUser.perfil.horarios.split(',')
        : [];
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  private getEmptyUser(): Usuario {
    return {
      nombre: '',
      email: '',
      password: '',
      rol: 'CLIENTE',
      perfil: { descripcion: '', especialidad: '', github: '', whatsapp: '', horarios: '' }
    };
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
