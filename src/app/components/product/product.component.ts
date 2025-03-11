import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product, Rating } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-product',
  template: `
    <div class="product-container" *ngIf="product">
      <div class="message" *ngIf="message">{{ message }}</div>
      
      <h3>{{ product.name }}</h3>
      
      <div class="product-layout">
        <div class="product-image">
          <img [src]="'/images/' + product.sku + '.jpg'" [alt]="product.name">
        </div>
        
        <div class="product-info">
          <div class="rating">
            <h4>Rating</h4>
            <div *ngIf="rating.rating_count > 0">
              {{ rating.avg_rating.toFixed(1) }} from {{ rating.rating_count }} votes
            </div>
            <div *ngIf="rating.rating_count === 0">
              No votes yet. Vote now.
            </div>
            <div class="stars">
              <img *ngFor="let star of [1,2,3,4,5]"
                   [id]="'vote-' + star"
                   class="vote-star"
                   src="/media/instana_icon_square.png"
                   [alt]="star"
                   (mouseover)="setStarOpacity(star, 1.0)"
                   (mouseleave)="setStarOpacity(star, 0.5)"
                   (click)="rateProduct(star)">
            </div>
          </div>

          <div class="description">
            {{ product.description }}
          </div>

          <div class="product-cart">
            <div class="price">Price €{{ product.price.toFixed(2) }}</div>
            
            <div *ngIf="product.instock === 0" class="out-of-stock">
              Out of stock
            </div>
            
            <div *ngIf="product.instock > 0" class="add-to-cart">
              Quantity 
              <input type="number" 
                     [(ngModel)]="quantity" 
                     min="1" 
                     max="10" 
                     class="quantity-input">
              <button (click)="addToCart()">Add to cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    .message {
      color: magenta;
      font-weight: bold;
      height: 30px;
      margin-bottom: 10px;
    }
    .product-layout {
      display: flex;
      gap: 40px;
      margin-top: 20px;
    }
    .product-image {
      flex: 0 0 400px;
      img {
        width: 100%;
        border: 2px solid cyan;
        padding: 5px;
      }
    }
    .product-info {
      flex: 1;
    }
    .rating {
      margin-bottom: 20px;
    }
    .stars {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    .vote-star {
      width: 30px;
      height: 30px;
      cursor: pointer;
      opacity: 0.5;
    }
    .description {
      margin: 20px 0;
    }
    .product-cart {
      border: 1px solid cyan;
      padding: 20px;
      margin-top: 20px;
    }
    .price {
      font-size: 1.2em;
      margin-bottom: 10px;
    }
    .quantity-input {
      width: 60px;
      margin: 0 10px;
    }
    .out-of-stock {
      color: red;
    }
  `]
})
export class ProductComponent implements OnInit {
  product: Product | null = null;
  rating: Rating = { avg_rating: 0, rating_count: 0 };
  quantity = 1;
  message = '';
  userId = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getCurrentUniqueId().subscribe(id => this.userId = id);
    
    this.route.params.subscribe(params => {
      const sku = params['sku'];
      this.loadProduct(sku);
      this.loadRating(sku);
    });
  }

  loadProduct(sku: string) {
    this.productService.getProduct(sku).subscribe(product => {
      this.product = product;
    });
  }

  loadRating(sku: string) {
    this.productService.getRating(sku).subscribe(rating => {
      this.rating = rating;
    });
  }

  setStarOpacity(vote: number, opacity: number) {
    for (let i = 1; i <= vote; i++) {
      const star = document.getElementById(`vote-${i}`);
      if (star) star.style.opacity = opacity.toString();
    }
  }

  rateProduct(rating: number) {
    if (!this.product) return;
    
    this.productService.rateProduct(this.product.sku, rating).subscribe(() => {
      this.message = 'Thank you for your feedback';
      this.loadRating(this.product!.sku);
      setTimeout(() => this.message = '', 3000);
    });
  }

  addToCart() {
    if (!this.product) return;
    
    this.cartService.addToCart(this.userId, this.product.sku, this.quantity)
      .subscribe(cart => {
        this.cartService.setCart(cart);
        this.message = 'Added to cart';
        setTimeout(() => this.message = '', 3000);
      });
  }
}