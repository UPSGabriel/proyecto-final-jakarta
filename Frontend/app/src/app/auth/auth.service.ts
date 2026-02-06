import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {

  http = inject(HttpClient);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);


  private readonly BASE_URL = 'https://backend-proyecto-final-ajik.onrender.com';

  currentUser$ = new BehaviorSubject<any>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.currentUser$.next(JSON.parse(storedUser));
      }
    }
  }


  login(creds: any) {
    const urlLogin = `${this.BASE_URL}/auth/login`;

    this.http.post<any>(urlLogin, creds).subscribe({
      next: (resp) => {
        console.log('🔥 RESPUESTA REAL RECIBIDA:', resp);


        const user = {
          id: resp.id,
          nombre: resp.nombre,
          email: creds.email,
          rol: resp.rol
        };

        console.log('✅ Usuario listo para sesión:', user);

        if (isPlatformBrowser(this.platformId)) {

          localStorage.setItem('jwt_token', resp.token);
          localStorage.setItem('user', JSON.stringify(user));
        }


        this.currentUser$.next(user);


        console.log('🚀 Intentando navegar a la ruta del rol:', user.rol);

        if (user.rol === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (user.rol === 'PROGRAMADOR') {
          this.router.navigate(['/programmer']);
        } else {
          this.router.navigate(['/public']);
        }
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        alert('Credenciales incorrectas o servidor fuera de línea.');
      }
    });
  }


  register(usuario: any) {

    const urlRegistro = `${this.BASE_URL}/usuarios`;

    const nuevoUsuario = { ...usuario, rol: 'CLIENTE' };

    return this.http.post(urlRegistro, nuevoUsuario);
  }
}
