import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router } from '@angular/router'; 

@Component({
  selector: 'app-nearby-pharmacies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nearby-pharmacies.html',
  styleUrl: './nearby-pharmacies.css'
})
export class NearbyPharmaciesComponent {
  constructor(private router: Router) { }
  goBack(): void { this.router.navigate(['/dashboard']); }
}
