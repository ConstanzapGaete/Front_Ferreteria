import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}

  categories = [
    {
      name: 'Herramientas Eléctricas',
      img: 'assets/images/cat-herramientas.jpg'
    },
    {
      name: 'Materiales de Construcción',
      img: 'assets/images/cat-materiales.jpg'
    },
    {
      name: 'Pinturas y Barnices',
      img: 'assets/images/cat-pinturas.jpg'
    },
    {
      name: 'Tornillos y Anclajes',
      img: 'assets/images/cat-tornillos.jpg'
    },
    {
      name: 'Adhesivos y Sellantes',
      img: 'assets/images/cat-adhesivos.jpg'
    },
    {
      name: 'Herramientas Manuales',
      img: 'assets/images/cat-manuales.png'
    }
  ];

  irACatalogo() {
    this.router.navigate(['/catalogo']);
  }
}

