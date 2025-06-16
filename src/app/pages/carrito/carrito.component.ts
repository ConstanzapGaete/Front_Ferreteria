import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  items: any[] = [];

  private cartService = inject(CartService);
  private router = inject(Router);

  ngOnInit(): void {
    this.items = this.cartService.getItems();
  }

  calcularCantidadTotal(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  calcularTotal(): number {
    return this.items.reduce((total, item) => total + item.cantidad * item.precio, 0);
  }

  calcularSubtotal(item: any): number {
    return item.cantidad * item.precio;
  }

  sumaItem(index: number): void {
    const producto = this.items[index];
    this.cartService.updateQuantity(producto.id, producto.cantidad + 1);
    this.items = this.cartService.getItems(); // Refrescar vista
  }

  restaItem(index: number): void {
    const producto = this.items[index];
    this.cartService.updateQuantity(producto.id, producto.cantidad - 1);
    this.items = this.cartService.getItems(); // Refrescar vista
  }

  eliminarItem(index: number): void {
    const producto = this.items[index];
    this.cartService.removeFromCart(producto.id);
    this.items = this.cartService.getItems(); // Refrescar vista
  }

  irACheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
