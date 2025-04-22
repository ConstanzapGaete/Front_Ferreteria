import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  items: any[] = [];

  constructor(private cartService: CartService) {}

  calcularTotal() {
    return this.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  calcularCantidadTotal() {
    return this.items.reduce((acc, item) => acc + item.cantidad, 0);
  }
  
  
  ngOnInit() {
    this.items = this.cartService.getItems();
    // con el back this.http.get('/api/carrito').subscribe(data => this.items = data);
  }
}
