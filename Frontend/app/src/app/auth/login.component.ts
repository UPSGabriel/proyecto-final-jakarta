import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // <--- Importante para el link
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
    // Usamos tu función login que ya maneja la redirección internamente
    this.authService.login(this.credentials);
  }
}