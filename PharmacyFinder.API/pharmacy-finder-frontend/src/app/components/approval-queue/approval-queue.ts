import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  contact: string;
  isApproved: boolean;
}

@Component({
  selector: 'app-approval-queue',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './approval-queue.html',
  styleUrls: ['./approval-queue.css']
})
export class ApprovalQueue implements OnInit {
  pharmacies: Pharmacy[] = [];
  isLoading = true;
  isApproving: { [key: number]: boolean } = {}; 

  private apiUrl = 'http://localhost:5067/api/Pharmacy';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPendingPharmacies();
  }

  private getAuthHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.showError('Authentication required. Please login.');
      setTimeout(() => this.router.navigate(['/login']), 2000);
      return null;
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadPendingPharmacies(): void {
    this.isLoading = true;
    this.pharmacies = [];

    const headers = this.getAuthHeaders();
    if (!headers) {
      this.isLoading = false;
      return;
    }

    this.http.get<Pharmacy[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => {
        this.pharmacies = Array.isArray(data) ? data.filter(p => !p.isApproved) : [];
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Load error:', err);
        this.isLoading = false;
        if (err.status === 401) {
          this.showError('Unauthorized. Please login again.');
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.showError('Failed to load pharmacies: ' + err.message);
        }
      }
    });
  }

  public get token(): string | null {
    return localStorage.getItem('auth_token');
  }

  approvePharmacy(id: number): void {
    const headers = this.getAuthHeaders();
    if (!headers) return;

    this.isApproving[id] = true;

    const url = `${this.apiUrl}/${id}/approve`; 
    this.http.put(url, {}, { headers }).subscribe({
      next: (res) => {
        this.showSuccess('Pharmacy approved successfully');
        this.pharmacies = this.pharmacies.filter(p => p.id !== id);
        this.isApproving[id] = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Approval error:', err);
        this.isApproving[id] = false;
        if (err.status === 401) {
          this.showError('Unauthorized. Please login again.');
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else if (err.status === 403) {
          this.showError('You are not authorized to approve pharmacies.');
        } else if (err.status === 404) {
          this.showError('Pharmacy not found.');
          this.loadPendingPharmacies();
        } else {
          this.showError('Failed to approve pharmacy: ' + err.message);
        }
      }
    });
  }
  public getValidToken(): string | null {
    return localStorage.getItem('auth_token');
  }


  checkAuthStatus(): void {
    console.log('Auth token:', localStorage.getItem('auth_token'));
    console.log('User role:', localStorage.getItem('user_role'));
  }

  showSuccess(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  showError(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }

  refresh(): void {
    this.loadPendingPharmacies();
  }
}
