import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: any[] = [];
  private cartKey = 'carrito';
  private cartCount = new BehaviorSubject<number>(0);
  private isBrowser: boolean;

  cartCount$ = this.cartCount.asObservable(); // Observable para el contador

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadCart();
    }
  }

  private saveCart() {
    if (this.isBrowser) {
      localStorage.setItem(this.cartKey, JSON.stringify(this.items));
      this.cartCount.next(this.getTotalItems());
    }
  }

  private loadCart() {
    if (this.isBrowser) {
      const data = localStorage.getItem(this.cartKey);
      this.items = data ? JSON.parse(data) : [];
      this.cartCount.next(this.getTotalItems());
    }
  }

  addToCart(product: any) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.cantidad += 1;
    } else {
      this.items.push({ ...product, cantidad: 1 });
    }
    this.saveCart();
  }

  removeFromCart(productId: number) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number) {
    const item = this.items.find(p => p.id === productId);
    if (item) {
      item.cantidad = quantity;
      if (item.cantidad <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
      }
    }
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
    if (this.isBrowser) {
      localStorage.removeItem(this.cartKey);
      this.cartCount.next(0);
    }
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }
}
