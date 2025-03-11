import { Component } from '@angular/core';
import { UserService, User } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import {HttpClient} from "@angular/common/http";

interface OrderHistory {
  orderid: string;
  cart: {
    items: Array<{name: string}>;
    total: number;
  };
}

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="message" *ngIf="message">{{ message }}</div>

      <div *ngIf="!currentUser" class="auth-forms">
        <div class="form-container">
          <h3>Login</h3>
          <form (ngSubmit)="login()" class="auth-form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" [(ngModel)]="loginForm.name" name="loginName">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" [(ngModel)]="loginForm.password" name="loginPassword">
            </div>
            <button type="submit">Login</button>
          </form>
        </div>

        <div class="form-container">
          <h3>Register</h3>
          <form (ngSubmit)="register()" class="auth-form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" [(ngModel)]="registerForm.name" name="registerName">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="registerForm.email" name="registerEmail">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" [(ngModel)]="registerForm.password" name="registerPassword">
            </div>
            <div class="form-group">
              <label>Confirm Password</label>
              <input type="password" [(ngModel)]="registerForm.password2" name="registerPassword2">
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>

      <div *ngIf="currentUser" class="user-profile">
        <h3>Welcome {{ currentUser.name }}</h3>
        <p>Email: {{ currentUser.email }}</p>
        
        <div class="order-history">
          <h3>Order History</h3>
          <table *ngIf="orderHistory.length > 0">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of orderHistory">
                <td>{{ order.orderid }}</td>
                <td>
                  <ul>
                    <li *ngFor="let item of order.cart.items">
                      {{ item.name }}
                    </li>
                  </ul>
                </td>
                <td class="price">€{{ order.cart.total.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
          <p *ngIf="orderHistory.length === 0">No orders yet</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    .message {
      color: magenta;
      text-align: center;
      margin-bottom: 20px;
    }
    .auth-forms {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
    .form-container {
      background: rgba(255,255,255,0.05);
      border: 1px solid cyan;
      border-radius: 8px;
      padding: 20px;
    }
    .auth-form {
      .form-group {
        margin-bottom: 15px;
        
        label {
          display: block;
          margin-bottom: 5px;
        }
        
        input {
          width: 100%;
        }
      }
      
      button {
        width: 100%;
        margin-top: 10px }
    }
    .user-profile {
      background: rgba(255,255,255,0.05);
      border: 1px solid cyan;
      border-radius: 8px;
      padding: 20px;
    }
    .order-history {
      margin-top: 30px;
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
      }
      
      th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid rgba(0,255,255,0.2);
      }
      
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .price {
        text-align: right;
      }
    }
  `]
})
export class LoginComponent {
  currentUser: User | null = null;
  orderHistory: OrderHistory[] = [];
  message = '';

  loginForm = {
    name: '',
    password: ''
  };

  registerForm = {
    name: '',
    email: '',
    password: '',
    password2: ''
  };

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private http: HttpClient
  ) {
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadOrderHistory(user.name);
      }
    });
  }

  login() {
    this.message = '';
    this.userService.login(this.loginForm.name, this.loginForm.password)
      .subscribe({
        next: (user) => {
          let oldId = '';
          this.userService.getCurrentUniqueId().subscribe(id => {
            oldId = id;
            this.userService.setCurrentUser(user);
            
            // Move cart to new user
            this.http.get(`/api/cart/rename/${oldId}/${user.name}`)
              .subscribe({
                next: () => console.log('Cart transferred successfully'),
                error: (e) => {
                  // 404 is OK as cart might not exist
                  if (e.status !== 404) {
                    console.error('Error transferring cart:', e);
                  }
                }
              });
          });
        },
        error: (e) => {
          this.message = `Error: ${e.error}`;
          this.loginForm.password = '';
        }
      });
  }

  register() {
    this.message = '';
    
    if (!this.registerForm.name || !this.registerForm.email || 
        !this.registerForm.password || !this.registerForm.password2) {
      this.message = 'All fields are required';
      return;
    }

    if (this.registerForm.password !== this.registerForm.password2) {
      this.message = 'Passwords do not match';
      this.registerForm.password = '';
      this.registerForm.password2 = '';
      return;
    }

    this.userService.register(
      this.registerForm.name,
      this.registerForm.email,
      this.registerForm.password
    ).subscribe({
      next: (user) => {
        this.userService.setCurrentUser(user);
        this.registerForm = {
          name: '',
          email: '',
          password: '',
          password2: ''
        };
      },
      error: (e) => {
        this.message = `Error: ${e.error}`;
        this.registerForm.password = '';
        this.registerForm.password2 = '';
      }
    });
  }

  private loadOrderHistory(userId: string) {
    this.http.get<{history: OrderHistory[]}>(`/api/user/history/${userId}`)
      .subscribe(response => {
        this.orderHistory = response.history;
      });
  }
}