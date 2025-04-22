import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-bodeguero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-bodeguero.component.html',
  styleUrl: './home-bodeguero.component.css'
})
export class HomeBodegueroComponent {

  seccionActiva = '';
}
