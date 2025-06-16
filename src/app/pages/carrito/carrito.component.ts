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
  resumenProductos: string[] = [];

  private cartService = inject(CartService);
  private router = inject(Router);

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.generarResumen();
  }

  generarResumen(): void {
    this.resumenProductos = this.items.map(item => `x${item.cantidad} ${item.nombre}`);
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
    this.items = this.cartService.getItems();
    this.generarResumen();
  }

  restaItem(index: number): void {
    const producto = this.items[index];
    this.cartService.updateQuantity(producto.id, producto.cantidad - 1);
    this.items = this.cartService.getItems();
    this.generarResumen();
  }

  eliminarItem(index: number): void {
    const producto = this.items[index];
    this.cartService.removeFromCart(producto.id);
    this.items = this.cartService.getItems();
    this.generarResumen();
  }

  irACheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
