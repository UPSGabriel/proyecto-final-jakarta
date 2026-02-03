import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common'; 

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID); 

  if (!isPlatformBrowser(platformId)) {
    return true; 
  }


  const token = localStorage.getItem('jwt_token');
  const userString = localStorage.getItem('user');

  if (!token || !userString) {

    router.navigate(['/login']);
    return false;
  }

  const user = JSON.parse(userString);
  const expectedRole = route.data['role'];


  if (user.role === expectedRole || user.rol === expectedRole || user.role === 'ADMIN') {
    return true; 
  } else {
    
    alert('⛔ Acceso Denegado: No tienes permisos para ver esta sección.');
    
 
    if (user.role === 'PROGRAMADOR' || user.rol === 'PROGRAMADOR') {
      router.navigate(['/programmer']);
    } else if (user.role === 'CLIENTE' || user.rol === 'CLIENTE') {
      router.navigate(['/public']);
    } else if (user.role === 'ADMIN' || user.rol === 'ADMIN') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/login']);
    }
    
    return false;
  }
};
