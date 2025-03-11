import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-search',
  template: `
    <div class="search-container">
      <div *ngIf="products.length === 0" class="no-results">
        Sorry, nothing matches your search
      </div>
      
      <div *ngIf="products.length > 0" class="results">
        <h3>These excellent candidates match your search</h3>
        <div class="product-grid">
          <div *ngFor="let product of products" class="product-card">
            <img [src]="'/images/' + product.sku + '.jpg'" [alt]="product.name">
            <h4>
              <a [routerLink]="['/product', product.sku]">{{ product.name }}</a>
            </h4>
            <p>{{ product.description }}</p>
            <div class="price">€{{ product.price.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    .no-results {
      text-align: center;
      padding: 40px;
      font-size: 1.2em;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .product-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid cyan;
      border-radius: 8px;
      padding: 15px;
      transition: transform 0.2s;
      
      &:hover {
        transform: translateY(-5px);
      }
      
      img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 4px;
      }
      
      h4 {
        margin: 10px 0;
        font-family: 'Orbitron', sans-serif;
      }
      
      p {
        font-size: 0.9em;
        margin-bottom: 10px;
      }
      
      .price {
        font-size: 1.2em;
        color: cyan;
      }
    }
  `]
})
export class SearchComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const searchText = params['text'];
      if (searchText) {
        this.searchProducts(searchText);
      }
    });
  }

  searchProducts(text: string) {
    this.productService.searchProducts(text).subscribe(products => {
      this.products = products;
    });
  }
}