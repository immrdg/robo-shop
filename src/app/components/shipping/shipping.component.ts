import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShippingService, Country, ShippingInfo } from '../../services/shipping.service';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-shipping',
  template: `
    <div class="shipping-container">
      <h3>Shipping Information</h3>
      
      <div class="shipping-form">
        <div class="form-group">
          <label>Select Country</label>
          <select [(ngModel)]="selectedCountry" 
                  (ngModelChange)="onCountryChange()"
                  class="select-input">
            <option [ngValue]="null">Choose a country</option>
            <option *ngFor="let country of countries" 
                    [ngValue]="country">
              {{ country.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Enter Location</label>
          <input type="text" 
                 [(ngModel)]="selectedLocation"
                 [disabled]="!selectedCountry"
                 (input)="onLocationInput($event)"
                 class="location-input">
          
          <div *ngIf="locations.length > 0" class="location-suggestions">
            <div *ngFor="let loc of locations"
                 (click)="selectLocation(loc)"
                 class="location-option">
              {{ loc.name }}
            </div>
          </div>
        </div>

        <button (click)="calculateShipping()"
                [disabled]="!canCalculate"
                class="calc-button">
          Calculate Shipping
        </button>

        <div *ngIf="shippingInfo" class="shipping-result">
          <div class="info-row">
            <span>Distance:</span>
            <span>{{ shippingInfo.distance }}km</span>
          </div>
          <div class="info-row">
            <span>Cost:</span>
            <span>€{{ shippingInfo.cost.toFixed(2) }}</span>
          </div>
          <button (click)="confirmShipping()" 
                  class="confirm-button">
            Confirm Shipping
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shipping-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .shipping-form {
      background: rgba(255,255,255,0.05);
      border: 1px solid cyan;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
    }
    .form-group {
      margin-bottom: 20px;
      
      label {
        display: block;
        margin-bottom: 8px;
      }
    }
    .select-input, .location-input {
      width: 100%;
      padding: 8px;
      background: rgba(255,255,255,0.1);
      border: 1px solid cyan;
      color: cyan;
      border-radius: 4px;
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    .location-suggestions {
      margin-top: 5px;
      border: 1px solid cyan;
      border-radius: 4px;
      max-height: 200px;
      overflow-y: auto;
    }
    .location-option {
      padding: 8px;
      cursor: pointer;
      
      &:hover {
        background: rgba(255,255,255,0.1);
      }
    }
    .calc-button, .confirm-button {
      width: 100%;
      margin-top: 20px;
      padding: 10px;
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    .shipping-result {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid cyan;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  `]
})
export class ShippingComponent implements OnInit {
  countries: Country[] = [];
  locations: any[] = [];
  selectedCountry: Country | null = null;
  selectedLocation = '';
  selectedLocationId = '';
  shippingInfo: ShippingInfo | null = null;
  canCalculate = false;
  userId = '';

  constructor(
    private shippingService: ShippingService,
    private userService: UserService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getCurrentUniqueId().subscribe(id => this.userId = id);
    this.loadCountries();
  }

  loadCountries() {
    this.shippingService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  onCountryChange() {
    this.selectedLocation = '';
    this.locations = [];
    this.canCalculate = false;
    this.shippingInfo = null;
  }

  onLocationInput(event: any) {
    const term = event.target.value;
    if (term && this.selectedCountry) {
      this.shippingService.getLocations(this.selectedCountry.code, term)
        .subscribe(locations => {
          this.locations = locations;
        });
    } else {
      this.locations = [];
    }
  }

  selectLocation(location: any) {
    this.selectedLocation = location.name;
    this.selectedLocationId = location.uuid;
    this.locations = [];
    this.canCalculate = true;
  }

  calculateShipping() {
    if (this.selectedLocationId) {
      this.shippingService.calculateShipping(this.selectedLocationId)
        .subscribe(info => {
          this.shippingInfo = {
            ...info,
            location: `${this.selectedCountry?.name} ${this.selectedLocation}`
          };
        });
    }
  }

  confirmShipping() {
    if (this.shippingInfo) {
      this.shippingService.confirmShipping(this.userId, this.shippingInfo)
        .subscribe(() => {
          this.router.navigate(['/payment']);
        });
    }
  }
}