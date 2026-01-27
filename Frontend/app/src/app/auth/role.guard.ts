import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);


  const token = localStorage.getItem('jwt_token');
  const userString = localStorage.getItem('user');

  if (!token || !userString) {
    
    router.navigate(['/login']);
    return false;
  }

  const user = JSON.parse(userString);

  const expectedRole = route.data['role'];


  if (user.role === expectedRole || user.rol === expectedRole) {
    return true; 
  } else {
  
    alert('⛔ Acceso Denegado: No tienes permisos para ver esta sección.');
    

    if (user.role === 'ADMIN') router.navigate(['/admin']);
    else if (user.role === 'PROGRAMADOR') router.navigate(['/programmer']);
    else router.navigate(['/public']);
    
    return false;
  }
};
