import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-medicine-compare',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="medicine-compare-container">
      <mat-card class="search-card">
        <mat-card-header>
          <div class="header-content">
            <button mat-icon-button (click)="goBack()" class="back-btn">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div>
              <mat-card-title>Find & Compare Medicines</mat-card-title>
              <mat-card-subtitle>Search for medicines and compare prices</mat-card-subtitle>
            </div>
          </div>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Enter Medicine Name</mat-label>
              <input matInput formControlName="medicineName" required>
              <mat-icon matSuffix>medication</mat-icon>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="isLoading">
              <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
              <span *ngIf="!isLoading">Search Medicines</span>
              <span *ngIf="isLoading">Searching...</span>
            </button>
          </form>

          <div *ngIf="errorMessage" class="error-message">
            <mat-icon>error</mat-icon>
            {{ errorMessage }}
          </div>

          <div *ngIf="searchResults.length > 0" class="search-results">
            <h3>Found {{ searchResults.length }} Medicine(s)</h3>
            
            <div class="results-grid">
              <mat-card *ngFor="let medicine of searchResults" class="medicine-card">
                <mat-card-content>
                  <h4>{{ medicine.medicineName }}</h4>
                  <div class="medicine-details">
                    <p><strong>Price:</strong> {{ medicine.price }}</p>
                    <p><strong>Quantity:</strong> {{ medicine.quantity }}</p>
                    <p><strong>Pharmacy ID:</strong> {{ medicine.pharmacyId }}</p>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>

          <div *ngIf="searchResults.length === 0 && !isLoading && searchForm.value.medicineName" class="no-results">
            <mat-icon>search_off</mat-icon>
            <p>No medicines found with this name. Try a different search term.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .medicine-compare-container { padding: 20px; max-width: 800px; margin: 0 auto; min-height: 100vh; background: #f5f5f5; }
    .search-card { padding: 24px; }
    .header-content { display: flex; align-items: center; gap: 16px; width: 100%; }
    .back-btn { margin-right: 8px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .search-results { margin-top: 24px; }
    .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-top: 16px; }
    .medicine-card { transition: transform 0.2s; }
    .medicine-card:hover { transform: translateY(-2px); }
    .medicine-card h4 { margin: 0 0 12px 0; color: #333; font-size: 1.2rem; }
    .medicine-details p { margin: 8px 0; color: #666; }
    .error-message { color: #f44336; background-color: #ffebee; border: 1px solid #f44336; border-radius: 4px; padding: 12px; margin: 16px 0; display: flex; align-items: center; gap: 8px; }
    .no-results { text-align: center; color: #666; padding: 40px 20px; }
    .no-results mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5; }
  `]
})
export class MedicineCompare {  // ← CHANGED THIS LINE
  searchForm: FormGroup;
  searchResults: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      medicineName: ['']
    });
  }

  onSearch(): void {
    const medicineName = this.searchForm.value.medicineName.trim();
    if (!medicineName) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.searchService.searchMedicines(medicineName).subscribe({
      next: (results: any) => {
        this.searchResults = results;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = error;
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
