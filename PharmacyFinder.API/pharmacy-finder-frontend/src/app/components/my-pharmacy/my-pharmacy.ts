import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  contact: string;
  licenseNumber: string;
  operatingHours: string;
}

interface Medicine {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-my-pharmacy',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './my-pharmacy.html',
  styleUrls: ['./my-pharmacy.css']
})
export class MyPharmacy implements OnInit {
  pharmacy: Pharmacy | null = null;
  medicines: Medicine[] = [];
  isLoading = false;
  errorMessage = '';
  private pharmacyUrl = '[http://localhost:5067/api/Owner/my-pharmacy](http://localhost:5067/api/Owner/my-pharmacy)';
  private medicineUrl = '[http://localhost:5067/api/Medicine/pharmacy](http://localhost:5067/api/Medicine/pharmacy)';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.loadPharmacy();
  }

  loadPharmacy(): void {
    this.isLoading = true;
    this.errorMessage = '';

const token = localStorage.getItem('jwtToken');
if (!token) {
  this.errorMessage = 'Authentication token missing. Please log in again.';
  this.router.navigate(['/login']);
  return;
}

const headers = new HttpHeaders({ Authorization: `Bearer ${ token } ` });

this.http.get<Pharmacy>(this.pharmacyUrl, { headers }).subscribe({
  next: (data) => {
    this.pharmacy = data;
    this.isLoading = false;

    if (data?.id) {
      this.loadMedicines(data.id, headers);
    } else {
      this.errorMessage = 'No pharmacy found for this owner.';
    }
  },
  error: (err) => {
    this.isLoading = false;
    console.error('Pharmacy load error:', err);
    if (err.status === 401) {
      this.errorMessage = 'Unauthorized. Please log in again.';
      this.router.navigate(['/login']);
    } else {
      this.errorMessage = 'Failed to load pharmacy data.';
    }
  }
});

  }

  loadMedicines(pharmacyId: number, headers: HttpHeaders): void {
    this.http.get<Medicine[]>(`${this.medicineUrl}/${pharmacyId}`, { headers }).subscribe({
      next: (data) => {
        this.medicines = data || [];
      },
      error: (err) => {
        console.error('Failed to load medicines:', err);
        if (err.status === 403) {
          this.errorMessage = 'You are not authorized to view these medicines.';
        } else {
          this.errorMessage = 'Failed to load medicines.';
        }
      }
    });
  }

  navigateToAddMedicine(): void {
    if (this.pharmacy) {
      this.router.navigate(['/add-medicine'], {
        queryParams: { pharmacyId: this.pharmacy.id }
      });
    }
  }

  navigateToMedicineInventory(): void {
    if (this.pharmacy) {
      this.router.navigate(['/medicine-inventory'], {
        queryParams: { pharmacyId: this.pharmacy.id }
      });
    }
  }
}
