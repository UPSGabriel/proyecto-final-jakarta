import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = {
    nombre: '',
    email: '',
    password: ''
  };

  onRegister() {
    if (!this.user.nombre || !this.user.email || !this.user.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        alert('✅ ¡Registro exitoso! Por favor inicia sesión.');
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al registrarse. El correo podría estar duplicado.');
      }
    });
  }
}