import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1><a routerLink="/">Stan's Robot Shop</a></h1>
      <app-navbar></app-navbar>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 a {
      color: cyan;
      text-decoration: none;
      font-family: 'Orbitron', sans-serif;
    }
  `]
})
export class AppComponent {}