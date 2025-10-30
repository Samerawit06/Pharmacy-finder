import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Medicine {
  id: number;
  pharmacyId: number; // make sure API provides this
  medicineName: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-get-medicines',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './get-medicines.html',
  styleUrls: ['./get-medicines.css']
})
export class GetMedicines {
  pharmacyId!: number;
  medicines: Medicine[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  private apiUrl = 'http://localhost:5067/api/Medicine/pharmacy';

  constructor(private http: HttpClient) { }

  fetchMedicines() {
    this.isLoading = true;
    this.errorMessage = null;
    this.medicines = [];

    this.http.get<Medicine[]>(this.apiUrl).subscribe({
      next: (data) => {
        
        if (this.pharmacyId) {
          this.medicines = data.filter(med => med.pharmacyId === this.pharmacyId);
        } else {
          this.medicines = data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch medicines:', err);
        this.errorMessage = 'Failed to fetch medicines. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
