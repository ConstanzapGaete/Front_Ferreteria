import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})

export class CatalogoComponent {


  productos = [
    {
      id: 1,
      nombre: 'Taladro Percutor Bosch',
      descripcion: 'Potente herramienta eléctrica para perforar.',
      precio: 89990,
      imagen: 'assets/images/taladro.jpg',
      marca: 'Bosch',
      categoria: 'Herramientas Eléctricas'
    },
    {
      id: 2,
      nombre: 'Martillo Stanley',
      descripcion: 'Martillo de carpintero 16 oz.',
      precio: 7990,
      imagen: 'assets/images/martillo.png',
      marca: 'Stanley',
      categoria: 'Herramientas Manuales'
    },
    {
      id: 3,
      nombre: 'Cemento Melon Especial',
      descripcion: 'Especial 25K.',
      precio: 4990,
      imagen: 'assets/images/cemento.jpg',
      marca: 'Melon',
      categoria: 'Materiales'
    }
  ];

  constructor(private cartService: CartService) {}
  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert(`${product.nombre} agregado al carrito 🛒`);
    // aqui va lo del backend
  }
}

/* ESTO PARA CUANDO YA ESTE LA API
export class CatalogoComponent implements OnInit {
  productos: any[] = []; // opcionalmente: productos: Producto[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://tubackend.com/api/productos')
      .subscribe(data => {
        this.productos = data;
      });
  }
}
*/