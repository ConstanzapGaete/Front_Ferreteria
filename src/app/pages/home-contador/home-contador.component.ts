import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-contador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-contador.component.html',
  styleUrl: './home-contador.component.css'
})
export class HomeContadorComponent {

  seccionActiva = '';
}
