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
  
  
  private readonly BASE_URL = 'http://localhost:8080/proyectoFinal/api';

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
       
        const user = { 
            email: creds.email, 
            role: resp.rol || resp.role 
        };
        
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('jwt_token', resp.token);
          localStorage.setItem('user', JSON.stringify(user));
        }

        this.currentUser$.next(user);
        
      
        if(user.role === 'ADMIN') this.router.navigate(['/admin']);
        else if(user.role === 'PROGRAMADOR') this.router.navigate(['/programmer']);
        else this.router.navigate(['/public']);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error: Credenciales incorrectas o ruta no encontrada.');
      }
    });
  }


  register(usuario: any) {
   
    const urlRegistro = `${this.BASE_URL}/usuarios`; 
    
    const nuevoUsuario = { ...usuario, rol: 'CLIENTE' };

    return this.http.post(urlRegistro, nuevoUsuario);
  }
}
