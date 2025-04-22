import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-vendedor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-vendedor.component.html',
  styleUrl: './home-vendedor.component.css'
})
export class HomeVendedorComponent {
  seccionActiva = '';

}
