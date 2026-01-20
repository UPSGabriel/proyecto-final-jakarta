import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-public', standalone: true,
  template: `
    <div style="padding: 20px;">
      <h1>Bienvenido al Portafolio P67</h1>
      <button (click)="descargar()">📄 Descargar Reporte PDF</button>
      <button (click)="testCita()">📅 Simular Cita (Prueba Backend)</button>
    </div>
  `
})
export class PublicComponent {
  http = inject(HttpClient);
  api = 'http://localhost:8080/proyectoFinal/api';

  descargar() { window.open(`${this.api}/reportes/pdf`, '_blank'); }
  
  testCita() {
    this.http.post(`${this.api}/asesorias`, {}).subscribe(() => alert('Cita enviada (Revisar consola Wildfly para WhatsApp)'));
  }
}