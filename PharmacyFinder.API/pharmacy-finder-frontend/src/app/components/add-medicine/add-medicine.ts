import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

interface Pharmacy {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './add-medicine.html',
  styleUrls: ['./add-medicine.css']
})
export class AddMedicine implements OnInit {
  addMedicineForm: FormGroup;
  baseUrl = 'http://localhost:5067/api/Medicine/pharmacy';
  pharmacyId!: number;
  pharmacyName = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.addMedicineForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadOwnerPharmacy();
  }

  loadOwnerPharmacy(): void {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Please log in first.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<Pharmacy>('http://localhost:5067/api/Owner/my-pharmacy', { headers }).subscribe({
      next: (data) => {
        if (!data || !data.id) {
          alert('No pharmacy found for this owner.');
          this.router.navigate(['/owner-dashboard']);
          return;
        }
        this.pharmacyId = data.id;
        this.pharmacyName = data.name;
      },
      error: (err) => {
        console.error('Error fetching pharmacy:', err);
        alert('Failed to load your pharmacy. Please log in again.');
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit(): void {
    if (!this.pharmacyId) return;

    if (this.addMedicineForm.valid) {
      const medicineData = this.addMedicineForm.value;
      const token = localStorage.getItem('jwtToken');

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const url = `${this.baseUrl}/${this.pharmacyId}`;

      this.http.post(url, medicineData, { headers }).subscribe({
        next: () => {
          alert('✅ Medicine added successfully!');
          this.addMedicineForm.reset();
          this.router.navigate(['/medicine-inventory'], { queryParams: { pharmacyId: this.pharmacyId } });
        },
        error: (err) => {
          console.error('Error adding medicine:', err);
          if (err.status === 403) {
            alert('❌ You are not authorized to add medicine for this pharmacy.');
          } else {
            alert('❌ Failed to add medicine. Please try again.');
          }
        }
      });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
}
