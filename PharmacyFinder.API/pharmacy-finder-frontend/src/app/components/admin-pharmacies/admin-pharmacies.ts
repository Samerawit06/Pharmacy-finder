import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  contact: string;
  email: string;
  isApproved: boolean;
  ownerId: number;
}

@Component({
  selector: 'app-admin-pharmacies',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-pharmacies.html',
  styleUrls: ['./admin-pharmacies.css']
})
export class AdminPharmacies implements OnInit {
  pharmacies: Pharmacy[] = [];
  isLoading: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAllPharmacies();
  }

  loadAllPharmacies(): void {
    this.isLoading = true;
    this.http.get<Pharmacy[]>('http://localhost:5067/api/Pharmacy').subscribe({
      next: (data) => {
        this.pharmacies = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pharmacies:', error);
        this.isLoading = false;
        this.snackBar.open('Error loading pharmacies', 'Close', { duration: 3000 });
      }
    });
  }

  approvePharmacy(pharmacyId: number): void {
    this.http.put(`http://localhost:5067/api/Pharmacy/${pharmacyId}/approve`, {}).subscribe({
      next: () => {
        this.loadAllPharmacies();
        this.snackBar.open('Pharmacy approved successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error approving pharmacy:', error);
        this.snackBar.open('Error approving pharmacy', 'Close', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/admin']);
  }
}
