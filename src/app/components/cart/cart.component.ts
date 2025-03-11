import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, Cart } from '../../services/cart.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cart',
  template: `
    <div class="cart-container">
      <h2>Shopping Cart</h2>
      
      <div *ngIf="cart.total === 0" class="empty-cart">
        Your cart is empty, get shopping!
      </div>

      <div *ngIf="cart.total > 0" class="cart-items">
        <table>
          <thead>
            <tr>
              <th>QTY</th>
              <th>Name</th>
              <th>Sub Total</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of cart.items">
              <td>
                <input type="number" 
                       [ngModel]="item.qty" 
                       (ngModelChange)="updateQuantity(item.sku, $event)"
                       min="0" max="10">
              </td>
              <td>{{ item.name }}</td>
              <td class="price">€{{ item.subtotal | number:'1.2-2' }}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">Tax</td>
              <td class="price">€{{ cart.tax | number:'1.2-2' }}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">Total</td>
              <td class="price">€{{ cart.total | number:'1.2-2' }}</td>
            </tr>
          </tbody>
        </table>
        
        <button (click)="checkout()" class="checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 10px;
      text-align: left;
    }
    .price {
      text-align: right;
    }
    .total-row {
      font-weight: bold;
    }
    .checkout-btn {
      float: right;
      padding: 10px 20px;
      background: cyan;
      color: black;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .empty-cart {
      text-align: center;
      padding: 40px;
      font-size: 1.2em;
    }
  `]
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], total: 0, tax: 0 };
  userId = '';

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getCurrentUniqueId().subscribe(id => {
      this.userId = id;
      this.loadCart();
    });
  }

  loadCart() {
    this.cartService.getCart(this.userId).subscribe(cart => {
      this.cart = cart;
      this.cartService.setCart(cart);
    });
  }

  updateQuantity(sku: string, qty: number) {
    this.cartService.updateCart(this.userId, sku, qty).subscribe(cart => {
      this.cart = cart;
      this.cartService.setCart(cart);
    });
  }

  checkout() {
    this.router.navigate(['/shipping']);
  }
}