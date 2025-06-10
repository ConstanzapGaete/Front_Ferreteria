import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-ventas.component.html',
  styleUrl: './tabla-ventas.component.css'
})
export class TablaVentasComponent {
  ventas = [
    {
      id: 1001,
      cliente: 'Juan Pérez',
      total: 45990,
      fecha: '2025-06-06',
      tipoEntrega: 'Retiro',
      estado: 'Pagado'
    },
    {
      id: 1002,
      cliente: 'María González',
      total: 88990,
      fecha: '2025-06-05',
      tipoEntrega: 'Delivery',
      estado: 'Pendiente'
    },
    {
      id: 1003,
      cliente: 'Carlos Soto',
      total: 32990,
      fecha: '2025-06-03',
      tipoEntrega: 'Retiro',
      estado: 'Pagado'
    }
  ];
}
