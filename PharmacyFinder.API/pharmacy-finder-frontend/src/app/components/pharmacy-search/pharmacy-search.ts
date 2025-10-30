import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  isApproved: boolean;
  latitude?: number;
  longitude?: number;
}

@Component({
  selector: 'app-pharmacy-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    //HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pharmacy-search.html',
  styleUrl: './pharmacy-search.css'
})
export class PharmacySearch {
  searchForm: FormGroup;
  searchResults: Pharmacy[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  private apiUrl = 'http://localhost:5067/api/Pharmacy/search';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.searchForm = this.fb.group({
      address: ['']
    });
  }

  onSearch(): void {
    const address = this.searchForm.value.address.trim();
    if (!address) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.searchResults = [];

   
    this.http.get<Pharmacy[]>(`${this.apiUrl}?address=${encodeURIComponent(address)}`)
      .subscribe({
        next: (results: Pharmacy[]) => {
          this.searchResults = results;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.errorMessage = 'Failed to search pharmacies. Please try again.';
          this.isLoading = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
