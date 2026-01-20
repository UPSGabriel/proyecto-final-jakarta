import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient); router = inject(Router);
  api = 'http://localhost:8080/proyectoFinal/api/auth';
  
  currentUser$ = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || 'null'));

  login(creds: any) {
    this.http.post<any>(`${this.api}/login`, creds).subscribe({
      next: (resp) => {
        localStorage.setItem('jwt_token', resp.token);
        const user = { email: creds.email, role: resp.rol };
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser$.next(user);
        
        if(resp.rol === 'ADMIN') this.router.navigate(['/admin']);
        else if(resp.rol === 'PROGRAMADOR') this.router.navigate(['/programmer']);
        else this.router.navigate(['/public']);
      },
      error: () => alert('Error de credenciales')
    });
  }
}


