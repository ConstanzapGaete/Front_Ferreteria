import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  items: any[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  calcularTotal() {
    return this.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  calcularCantidadTotal() {
    return this.items.reduce((acc, item) => acc + item.cantidad, 0);
  }
  
  sumaItem(index: number) {
  this.items[index].cantidad++;
}

  restaItem(index: number) {
    if (this.items[index].cantidad > 1) {
      this.items[index].cantidad--;
    }
  }

  eliminarItem(index: number) {
    this.items.splice(index, 1);
  }

  irACheckout() {
  this.router.navigate(['/checkout']);
  }

  
  ngOnInit() {
    this.items = this.cartService.getItems();
    // con el back this.http.get('/api/carrito').subscribe(data => this.items = data);
  }
}
