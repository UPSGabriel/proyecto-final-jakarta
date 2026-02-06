import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/entidades';
import { SpringBootService } from '../../services/springboot.service';
import { PythonService } from '../../services/python.service';
import { Router } from '@angular/router';

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

  private readonly JAKARTA_API = 'https://backend-proyecto-final-ajik.onrender.com/usuarios';
  private readonly PYTHON_API = 'https://backend-python-upxt.onrender.com/notificaciones/enviar';

  users: Usuario[] = [];
  statsData: any = null;

  selectedUser: Usuario = this.getEmptyUser();
  isModalOpen = false;
  isNewUser = true;

  nuevoHorario: string = '';
  horariosList: string[] = [];

  showEmailModal = false;
  isEnviando = false;
  emailData = {
    destinatario: '',
    asunto: '',
    mensaje: ''
  };

  ngOnInit() {
    this.loadUsersFromJakarta();
    this.loadStatsFromSpringBoot();
  }

  loadStatsFromSpringBoot() {
    this.springService.getEstadisticas().subscribe({
      next: (data) => {
        console.log('✅ Datos de Spring Boot recibidos:', data);
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
      alert(`⚠️ El horario "${horarioLimpio}" ya está registrado en la lista.`);
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
