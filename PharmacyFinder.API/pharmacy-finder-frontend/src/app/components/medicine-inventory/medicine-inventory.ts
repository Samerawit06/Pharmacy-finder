import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


interface Medicine {
  id: number;
  medicineName: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-medicine-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './medicine-inventory.html',
  styleUrls: ['./medicine-inventory.css']
})
export class MedicineInventory {
  pharmacyId!: number;
  medicines: Medicine[] = [];
  isLoading = false;
  errorMessage = '';

  private apiUrl = 'http://localhost:5067/api/Medicine/pharmacy';

  constructor(private http: HttpClient) { }

  fetchMedicines() {
    if (!this.pharmacyId) return;
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<Medicine[]>(`${this.apiUrl}/${this.pharmacyId}`).subscribe({
      next: (data) => {
        this.medicines = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to fetch medicines';
        this.isLoading = false;
      }
    });
  }

  // ✅ This is the delete method
  deleteMedicine(medicineId: number) {
    if (!this.pharmacyId) return;

    if (!confirm('Are you sure you want to delete this medicine?')) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.http.delete(`${this.apiUrl}/${this.pharmacyId}/medicine/${medicineId}`).subscribe({
      next: () => {
        this.medicines = this.medicines.filter(m => m.id !== medicineId);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to delete medicine';
        this.isLoading = false;
      }
    });
  }
}
