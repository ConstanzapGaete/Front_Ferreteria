import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-no-autorizado',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align: center; margin-top: 80px;">
      <h2 style="color: #c62828;">Acceso Denegado</h2>
      <p>No tienes permisos para acceder a esta sección.</p>
      <a routerLink="/login">Volver al login</a>
    </div>
  `
})
export class NoAutorizadoComponent {}
