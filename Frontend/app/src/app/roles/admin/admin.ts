import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/entidades'; 

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent implements OnInit {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/proyectoFinal/api/usuarios';

  users: Usuario[] = [];
  selectedUser: Usuario = this.getEmptyUser();
  isModalOpen = false;
  isNewUser = true;

  ngOnInit() {
    this.loadUsers();
  }


  loadUsers() {
    this.http.get<Usuario[]>(this.apiUrl).subscribe({
      next: (data) => this.users = data,
      error: (e) => console.error('Error cargando usuarios:', e)
    });
  }


  saveUser() {

    if (!this.selectedUser.nombre || !this.selectedUser.email || !this.selectedUser.rol) {
      alert('Por favor completa nombre, email y rol.');
      return;
    }

    if (this.isNewUser) {
      
      this.http.post(this.apiUrl, this.selectedUser).subscribe({
        next: () => {
          alert('Usuario creado correctamente ✅');
          this.closeModal();
          this.loadUsers();
        },
        error: () => alert('Error al crear usuario.')
      });
    } else {
 
      this.http.put(this.apiUrl, this.selectedUser).subscribe({
        next: () => {
          alert('Usuario actualizado ✅');
          this.closeModal();
          this.loadUsers();
        },
        error: () => alert('Error al actualizar usuario.')
      });
    }
  }

  deleteUser(user: Usuario) {
    if (!user.id) return;
    
    if (confirm(`¿Estás seguro de eliminar a ${user.nombre}?`)) {
      this.http.delete(`${this.apiUrl}/${user.id}`).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: () => alert('Error al eliminar usuario.')
      });
    }
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
