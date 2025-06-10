import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  tipoEntrega: 'retiro' | 'delivery' = 'retiro';

  regiones: string[] = [
    'Antofagasta',
    'Arica y Parinacota',
    'Atacama',
    'Aysén del Gral. Carlos Ibáñez del Campo',
    'Biobío',
    'Coquimbo',
    'La Araucanía',
    'Los Lagos',
    'Los Ríos',
    'Magallanes y de la Antártica Chilena',
    'Maule',
    'Ñuble',
    'O’Higgins',
    'Región Metropolitana',
    'Tarapacá',
    'Valparaíso'
  ];

  datosDespacho = {
    region: '',
    calle: '',
    numero: '',
    dpto: ''
  };

  carrito: any[] = [];
  totalProductos: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.carrito = this.cartService.getItems();
    this.totalProductos = this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  get totalFinal() {
    return this.tipoEntrega === 'delivery'
      ? this.totalProductos + 3000
      : this.totalProductos;
  }

  pagarCompra() {
    if (this.tipoEntrega === 'delivery') {
      const { region, calle, numero } = this.datosDespacho;

      if (!region || !calle.trim() || !numero.trim()) {
        alert('Por favor completa todos los campos obligatorios de despacho.');
        return;
      }
    }

    alert(`Compra realizada correctamente.\nTotal: CLP ${this.totalFinal.toLocaleString()}`);
    // Aquí podrías limpiar el carrito si lo deseas:
    // this.cartService.clearCart();
  }
}
