import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="search-box">
        <input type="text" [(ngModel)]="searchText" placeholder="Search robots...">
        <button (click)="search()">Search</button>
      </div>
      <div class="nav-links">
        <a routerLink="/login">Login / Register</a>
        <a routerLink="/cart">
          Cart (€{{ cartTotal | number:'1.2-2' }})
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      margin: 1rem 0;
    }
    .search-box {
      display: flex;
      gap: 0.5rem;
    }
    .nav-links {
      display: flex;
      gap: 1rem;
    }
    a {
      color: cyan;
      text-decoration: none;
    }
  `]
})
export class NavbarComponent implements OnInit {
  searchText = '';
  cartTotal = 0;

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.cartService.getCurrentCart().subscribe(cart => {
      this.cartTotal = cart.total;
    });
  }

  search() {
    if (this.searchText.trim()) {
      this.router.navigate(['/search', this.searchText.trim()]);
      this.searchText = '';
    }
  }
}