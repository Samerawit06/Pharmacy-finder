import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './customer-dashboard.html',
  styleUrls: ['./customer-dashboard.css']
})
export class CustomerDashboard {
  constructor(private router: Router) { }

  navigateToPrescriptionUpload(): void {
    this.router.navigate(['/prescription-upload']);
  }

  navigateToPharmacySearch(): void {
    this.router.navigate(['/pharmacy-search']);
  }

  navigateToMedicineCompare(): void {
    this.router.navigate(['/medicine-compare']);
  }

  
  // navigateToMedicineSearch() - no corresponding route
  // navigateToNearbyPharmacies() - no corresponding route
}
