import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaPagosComponent } from '../../components/tabla-pagos/tabla-pagos.component';

@Component({
  selector: 'app-home-contador',
  standalone: true,
  imports: [CommonModule, TablaPagosComponent],
  templateUrl: './home-contador.component.html',
  styleUrl: './home-contador.component.css'
})
export class HomeContadorComponent {

  seccionActiva = '';
}
