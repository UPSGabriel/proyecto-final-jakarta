import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);

  credentials = {
    email: '',
    password: ''
  };

  onLogin() {
    if (!this.credentials.email || !this.credentials.password) {
      alert('Por favor, ingresa tus credenciales.');
      return;
    }

    console.log('🔐 Intentando iniciar sesión para:', this.credentials.email);
    this.authService.login(this.credentials);
  }
}
