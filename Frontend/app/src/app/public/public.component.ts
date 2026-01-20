import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { PublicService } from '../services/public'; 
import { Usuario } from '../models/entidades';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  private publicService = inject(PublicService);

  programadores: Usuario[] = [];

  ngOnInit() {
    this.cargarProgramadores();
  }

  cargarProgramadores() {
    this.publicService.getProgramadores().subscribe({
      next: (data) => {
        this.programadores = data;
        console.log('Programadores cargados:', this.programadores);
      },
      error: (e) => console.error('Error al cargar programadores', e)
    });
  }

  descargar() {

    const url = this.publicService.getReportePdfUrl();
    window.open(url, '_blank');
  }

  testCita() {
    const citaPrueba = {
      tema: 'Asesoría de Angular',
      fecha: '2025-12-01',
      hora: '10:00',
      estado: 'PENDIENTE'
    };

    this.publicService.agendarCita(citaPrueba).subscribe({
      next: () => alert('✅ Cita agendada con éxito (Revisa la consola de Eclipse/Wildfly)'),
      error: () => alert('❌ Error al agendar cita')
    });
  }
}