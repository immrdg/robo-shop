import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, Cart } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  template: `
    <div class="payment-container">
      <h3>Review your order</h3>
      
      <div *ngIf="cart.total === 0" class="empty-cart">
        No items in cart
      </div>

      <div *ngIf="cart.total > 0" class="order-review">
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
              <td>{{ item.qty }}</td>
              <td>{{ item.name }}</td>
              <td class="price">€{{ item.subtotal.toFixed(2) }}</td>
            </tr>
            <tr class="spacer"><td colspan="3"></td></tr>
            <tr class="total-row">
              <td colspan="2">Tax</td>
              <td class="price">€{{ cart.tax.toFixed(2) }}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">Total</td>
              <td class="price">€{{ cart.total.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="payment-actions">
          <button (click)="processPayment()"
                  [disabled]="processing"
                  class="pay-button">
            {{ processing ? 'Processing...' : 'Pay Now' }}
          </button>
        </div>

        <div *ngIf="message" class="message">
          {{ message }}
        </div>

        <div *ngIf="orderComplete" class="order-complete">
          <p>Thank you for your order</p>
          <a routerLink="/" class="continue-shopping">Continue shopping</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .empty-cart {
      text-align: center;
      padding: 40px;
      font-size: 1.2em;
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
    .spacer td {
      height: 20px;
    }
    .total-row {
      font-weight: bold;
    }
    .payment-actions {
      text-align: right;
      margin: 20px 0;
    }
    .pay-button {
      padding: 12px 24px;
      font-size: 1.1em;
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    .message {
      text-align: center;
      color: magenta;
      margin: 20px 0;
    }
    .order-complete {
      text-align: center;
      margin: 40px 0;
      
      p {
        font-size: 1.2em;
        margin-bottom: 20px;
      }
    }
    .continue-shopping {
      font-weight: bold;
      font-size: 1.1em;
    }
  `]
})
export class PaymentComponent implements OnInit {
  cart: Cart = { items: [], total: 0, tax: 0 };
  processing = false;
  message = '';
  orderComplete = false;
  userId = '';

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getCurrentUniqueId().subscribe(id => {
      this.userId = id;
      this.loadCart();
    });
  }

  loadCart() {
    this.cartService.getCurrentCart().subscribe(cart => {
      this.cart = cart;
    });
  }

  processPayment() {
    this.processing = true;
    this.message = '';

    this.http.post(`/api/payment/pay/${this.userId}`, this.cart)
      .subscribe({
        next: (response: any) => {
          this.message = `Order placed ${response.orderid}`;
          this.orderComplete = true;
          this.processing = false;
          
          // Clear cart
          const emptyCart = { items: [], total: 0, tax: 0 };
          this.cartService.setCart(emptyCart);
          this.cart = emptyCart;
        },
        error: (error) => {
          this.message = 'Error processing payment';
          this.processing = false;
        }
      });
  }
}