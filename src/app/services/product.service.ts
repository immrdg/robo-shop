import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  sku: string;
  name: string;
  description: string;
  price: number;
  instock: number;
}

export interface Rating {
  avg_rating: number;
  rating_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>('/api/catalogue/categories');
  }

  getProducts(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`/api/catalogue/products/${category}`);
  }

  getProduct(sku: string): Observable<Product> {
    return this.http.get<Product>(`/api/catalogue/product/${sku}`);
  }

  searchProducts(text: string): Observable<Product[]> {
    return this.http.get<Product[]>(`/api/catalogue/search/${text}`);
  }

  getRating(sku: string): Observable<Rating> {
    return this.http.get<Rating>(`/api/ratings/api/fetch/${sku}`);
  }

  rateProduct(sku: string, rating: number): Observable<void> {
    return this.http.put<void>(`/api/ratings/api/rate/${sku}/${rating}`, {});
  }
}