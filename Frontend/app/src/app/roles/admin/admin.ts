import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/entidades'; 
import { SpringBootService } from '../../services/springboot.service'; 
import { PythonService } from '../../services/python.service'; 

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

  private readonly JAKARTA_API = 'http://localhost:8080/proyectoFinal/api/usuarios';

  private readonly PYTHON_API = 'http://localhost:8000/notificaciones/enviar';

  users: Usuario[] = [];       
  statsData: any = null;        
  
  selectedUser: Usuario = this.getEmptyUser();
  isModalOpen = false;
  isNewUser = true;


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
        console.warn('⚠️ No se pudo conectar con Spring Boot (Puerto 8081). ¿Está encendido?');
        console.error(e);
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

  saveUser() {
    if (!this.selectedUser.nombre || !this.selectedUser.email || !this.selectedUser.rol) {
      alert('Por favor completa los campos obligatorios.');
      return;
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
        
        console.log('✅ Excel descargado desde Python');
      },
      error: (err) => {
        console.error('❌ Error descargando Excel:', err);
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
        console.error(err);
        alert('❌ Error al enviar. Revisa que Python (Puerto 8000) esté encendido.');
        this.isEnviando = false; 
      }
    });
  }

  openCreateModal() {
    this.isNewUser = true;
    this.selectedUser = this.getEmptyUser();
    this.isModalOpen = true;
  }

  openEditModal(user: Usuario) {
    this.isNewUser = false;
    this.selectedUser = { ...user }; 
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
      rol: 'CLIENTE'
    };
  }
}