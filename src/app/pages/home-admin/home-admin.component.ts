import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaVentasComponent } from '../../components/tabla-ventas/tabla-ventas.component';
import { TablaUsuariosComponent } from '../../components/tabla-usuarios/tabla-usuarios.component';
import { GraficoPedidosComponent } from '../../components/grafico-pedidos/grafico-pedidos.component';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [
    CommonModule,
    TablaVentasComponent,
    TablaUsuariosComponent,
    GraficoPedidosComponent,
  ],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css',
})
export class HomeAdminComponent {
  token = localStorage.getItem('token');

  seccionActiva = '';

  ngOnInit(): void {
    console.log('token', this.token);
  }
}
