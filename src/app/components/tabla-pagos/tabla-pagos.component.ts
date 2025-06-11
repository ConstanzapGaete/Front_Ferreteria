import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-pagos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-pagos.component.html',
  styleUrl: './tabla-pagos.component.css'
})
export class TablaPagosComponent implements OnInit {
  pagosPendientes = [
    { id: 1, cliente: 'Juan Pérez', monto: 25990, fecha: '2025-06-10', estado: 'pendiente'  },
    { id: 2, cliente: 'María Torres', monto: 75990, fecha: '2025-06-09', estado: 'pendiente'  },
    { id: 3, cliente: 'Luis Vargas', monto: 15990, fecha: '2025-06-08', estado: 'pendiente'  },
  ];

  confirmarPago(id: number) {
  const pago = this.pagosPendientes.find(p => p.id === id);
  if (pago) pago.estado = 'confirmado';
}

  rechazarPago(id: number) {
    const pago = this.pagosPendientes.find(p => p.id === id);
    if (pago) pago.estado = 'rechazado';
  }

  ngOnInit(): void {}
}
