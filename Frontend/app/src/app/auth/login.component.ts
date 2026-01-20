import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Usuario } from '.././models/entidades';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);


  credentials: Usuario = {
    nombre: '', 
    email: '',
    password: '',
    rol: 'CLIENTE' 
  };

  isLoading = false;
  errorMessage = '';

  onLogin() {
   
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Por favor, ingresa correo y contraseña.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials);

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  
  goToRegister() {
    
    alert('Implementa tu registro aquí o usa el Admin para crear usuarios.');
  }
}