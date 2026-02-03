import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { AdminComponent } from './roles/admin/admin';
import { ProgrammerComponent } from './roles/programmer/programmer';
import { PublicComponent } from './public/public.component';
import { roleGuard } from './auth/role.guard'; 
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [
  
  { path: '', redirectTo: '/registro', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'public', component: PublicComponent },
  { path: 'registro', component: RegisterComponent },

 
  { 
    path: 'admin', 
    component: AdminComponent,
    canActivate: [roleGuard],      
    data: { role: 'ADMIN' }        
  },

  { 
    path: 'programmer', 
    component: ProgrammerComponent,
    canActivate: [roleGuard],      
    data: { role: 'PROGRAMADOR' }  
  },

  
];