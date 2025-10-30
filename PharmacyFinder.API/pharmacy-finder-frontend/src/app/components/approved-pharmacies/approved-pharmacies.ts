import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isApproved: boolean;
}

@Component({
  selector: 'app-approved-pharmacies',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './approved-pharmacies.html',
  styleUrls: ['./approved-pharmacies.css']
})
export class ApprovedPharmacies {
  pharmacies: Pharmacy[] = [];
  isLoading = true;

  private apiUrl = 'http://localhost:5067/api/Pharmacy/approved';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.loadApprovedPharmacies();
  }

  loadApprovedPharmacies(): void {
    this.isLoading = true;
    this.http.get<Pharmacy[]>(this.apiUrl).subscribe({
      next: (data) => {
        // ✅ Explicitly filter to avoid any bad data from API
        this.pharmacies = data.filter(p => p.isApproved === true);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showError('Failed to load approved pharmacies');
      }
    });
  }

  // Optional: Unapprove pharmacy (if backend supports it)
  //unapprovePharmacy(id: number): void {
  //  this.http.put(`http://localhost:5067/api/pharmacy/${id}/unapprove`, {}).subscribe({
  //    next: () => {
  //      this.showSuccess('Pharmacy unapproved successfully');
  //      this.loadApprovedPharmacies();
  //    },
  //    error: () => this.showError('Failed to unapprove pharmacy')
  //  });
  //}

  private showSuccess(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  private showError(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
