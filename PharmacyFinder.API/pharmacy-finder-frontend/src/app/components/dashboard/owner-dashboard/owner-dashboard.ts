import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './owner-dashboard.html',
  styleUrls: ['./owner-dashboard.css']
})
export class OwnerDashboard {
  title = 'Owner Dashboard';
  constructor(private router: Router) { }

  navigateToMyPharmacy(): void {
    this.router.navigate(['/my-pharmacy']);
  }

  navigateToMedicineInventory(): void {
    this.router.navigate(['/medicine-inventory']);
  }

  navigateToAddMedicine(): void {
    this.router.navigate(['/add-medicine']);
  }

  //navigateToAnalytics(): void {
  //  this.router.navigate(['/analytics']);
  //}

  navigateToOrders(): void {
    this.router.navigate(['/orders']);
  }

  //navigateToSettings(): void {
  //  this.router.navigate(['/settings']);
  //}
}
