import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {
  constructor(private router: Router) { }

  navigateToAllPharmacies(): void {
    this.router.navigate(['/admin-pharmacies']);
  }

  navigateToApprovalQueue(): void {
    this.router.navigate(['/approval-queue']);
  }

  navigateToAddPharmacy(): void {
    this.router.navigate(['/add-pharmacy']);
  }

  navigateToGetMedicines(): void {
    this.router.navigate(['/get-medicines']);
  }

  //navigateToSystemOverview(): void {
  //  this.router.navigate(['/system-overview']);
  //}
}
