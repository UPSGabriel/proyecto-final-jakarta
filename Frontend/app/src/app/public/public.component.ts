import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // 👈 Importante
import { PublicService } from '../services/public';
import { AuthService } from '../auth/auth.service';
import { Usuario, Asesoria } from '../models/entidades';
import { Router } from '@angular/router';

// 👇 Importamos Chart.js
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  private publicService = inject(PublicService);
  private authService = inject(AuthService);
  private http = inject(HttpClient); // 👈 Inyectamos HTTP
  private router = inject(Router);

  // URL del Backend para obtener citas
  private readonly JAVA_API_ASESORIAS = 'http://localhost:8080/proyectoFinal/api/asesorias';

  programadores: Usuario[] = [];
  currentUser: Usuario | null = null;

  // 👇 Variables para el Dashboard del Cliente
  misSolicitudes: Asesoria[] = [];
  public chart: any;

  isModalOpen = false;
  selectedProgrammer: Usuario | null = null;

  newCita = {
    tema: '',
    mensaje: '',
    fecha: '',
    hora: ''
  };

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;

      // Si hay usuario logueado, cargamos sus datos para el gráfico
      if (this.currentUser) {
        this.cargarMisSolicitudes();
      }
    });

    this.cargarProgramadores();
  }

  // 👇 CARGAR SOLICITUDES DEL CLIENTE (Backend)
  cargarMisSolicitudes() {
    if (!this.currentUser?.id) return;

    // Asumimos que existe un endpoint /cliente/{id} similar al del programador
    // Si no existe, usamos el filtro general, pero probemos esto primero.
    this.http.get<Asesoria[]>(`${this.JAVA_API_ASESORIAS}/cliente/${this.currentUser.id}`)
      .subscribe({
        next: (data) => {
          this.misSolicitudes = data;
          this.renderizarGrafico(); // Pintamos el gráfico
        },
        error: (e) => console.error('Error cargando historial del cliente', e)
      });
  }

  // 👇 PINTAR EL GRÁFICO (Igual que en Programmer)
  renderizarGrafico() {
    const pendientes = this.misSolicitudes.filter(a => a.estado === 'PENDIENTE').length;
    const aceptadas = this.misSolicitudes.filter(a => a.estado === 'ACEPTADA').length;
    const rechazadas = this.misSolicitudes.filter(a => a.estado === 'RECHAZADA').length;

    if (this.chart) {
      this.chart.destroy();
    }

    // Esperamos un ciclo para asegurar que el <canvas> exista en el DOM
    setTimeout(() => {
      const canvas = document.getElementById('clienteChart') as HTMLCanvasElement;
      if (!canvas) return;

      this.chart = new Chart("clienteChart", {
        type: 'pie', // Usamos 'Pie' (Pastel) para diferenciarlo un poco del programador
        data: {
          labels: ['Pendientes', 'Aceptadas', 'Rechazadas'],
          datasets: [{
            data: [pendientes, aceptadas, rechazadas],
            backgroundColor: [
              '#fbbf24', // Amarillo
              '#34d399', // Verde Menta
              '#f87171'  // Rojo Suave
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Resumen de mis Gestiones'
            }
          }
        }
      });
    }, 100);
  }

  cargarProgramadores() {
    this.publicService.getProgramadores().subscribe({
      next: (data) => {
        this.programadores = data.filter(u => u.rol === 'PROGRAMADOR');
      },
      error: (e) => console.error('Error al cargar programadores', e)
    });
  }

  descargar() {
    const url = this.publicService.getReportePdfUrl();
    window.open(url, '_blank');
  }

  abrirModalAgendar(prog: Usuario) {
    if (!this.currentUser) {
      alert("Debes iniciar sesión para agendar una cita.");
      this.router.navigate(['/login']);
      return;
    }
    this.selectedProgrammer = prog;
    this.newCita = { tema: '', mensaje: '', fecha: '', hora: '' };
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.selectedProgrammer = null;
  }

  validarHorario(): boolean {
    if (!this.selectedProgrammer?.perfil?.horarios) return true;
    const fechaSeleccionada = new Date(this.newCita.fecha + 'T00:00:00');
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaElegido = diasSemana[fechaSeleccionada.getDay()];
    const horariosProg = this.selectedProgrammer.perfil.horarios;

    if (!horariosProg.includes(diaElegido)) {
      alert(`⚠️ El programador no atiende los días ${diaElegido}.\n\nSus horarios son:\n${horariosProg}`);
      return false;
    }
    return true;
  }

  confirmarCita() {
    if (!this.newCita.tema || !this.newCita.fecha || !this.newCita.hora) {
      alert("Por favor completa todos los campos.");
      return;
    }
    if (!this.validarHorario()) return;

    const cleanCliente: Usuario = {
      id: this.currentUser!.id,
      nombre: this.currentUser!.nombre,
      email: this.currentUser!.email,
      rol: this.currentUser!.rol || (this.currentUser as any).role,
      password: this.currentUser!.password
    };

    const cleanProgrammer: Usuario = {
      id: this.selectedProgrammer!.id,
      nombre: this.selectedProgrammer!.nombre,
      email: this.selectedProgrammer!.email,
      rol: this.selectedProgrammer!.rol,
    };

    const asesoria: Asesoria = {
      tema: this.newCita.tema,
      fecha: this.newCita.fecha,
      hora: this.newCita.hora,
      estado: 'PENDIENTE',
      cliente: cleanCliente,
      programador: cleanProgrammer
    };

    this.publicService.agendarCita(asesoria).subscribe({
      next: () => {
        alert('✅ ¡Solicitud enviada con éxito! El programador revisará tu petición.');
        this.cerrarModal();
        // Recargar el gráfico del cliente para ver la nueva "Pendiente"
        this.cargarMisSolicitudes();
      },
      error: (e) => {
        console.error(e);
        alert('❌ Error al agendar. Revisa la consola para más detalles.');
      }
    });
  }


  logout() {
    localStorage.clear();
    this.currentUser = null;
    this.misSolicitudes = []; // Limpiamos datos
    this.router.navigate(['/login']);
  }
}
