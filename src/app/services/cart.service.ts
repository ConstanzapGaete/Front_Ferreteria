import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: any[] = [];

  addToCart(product: any) {
    this.items.push(product);
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
