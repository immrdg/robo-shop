import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  sku: string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  tax: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new BehaviorSubject<Cart>({ items: [], total: 0, tax: 0 });
  
  constructor(private http: HttpClient) {}

  getCart(userId: string): Observable<Cart> {
    return this.http.get<Cart>(`/api/cart/cart/${userId}`);
  }

  addToCart(userId: string, sku: string, qty: number): Observable<Cart> {
    return this.http.get<Cart>(`/api/cart/add/${userId}/${sku}/${qty}`);
  }

  updateCart(userId: string, sku: string, qty: number): Observable<Cart> {
    return this.http.get<Cart>(`/api/cart/update/${userId}/${sku}/${qty}`);
  }

  getCurrentCart(): Observable<Cart> {
    return this.cart.asObservable();
  }

  setCart(cart: Cart): void {
    this.cart.next(cart);
  }
}