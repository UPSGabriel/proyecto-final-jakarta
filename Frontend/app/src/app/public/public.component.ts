import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicService } from '../services/public';
import { AuthService } from '../auth/auth.service';
import { Usuario, Asesoria } from '../models/entidades';
import { Router } from '@angular/router';

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
  private router = inject(Router);

  programadores: Usuario[] = [];
  currentUser: Usuario | null = null;

  isModalOpen = false;
  selectedProgrammer: Usuario | null = null;

  newCita = {
    tema: '',
    mensaje: '',
    fecha: '',
    hora: ''
  };

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => this.currentUser = u);
    this.cargarProgramadores();
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
    this.router.navigate(['/login']);
  }
}
