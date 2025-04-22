import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: any[] = [];

  addToCart(product: any) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.cantidad += 1;
    } else {
      this.items.push({ ...product, cantidad: 1 });
    }
  }

  // luego con backend this.http.post('/api/carrito', product).subscribe();


  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
    return this.items;
  }
}
