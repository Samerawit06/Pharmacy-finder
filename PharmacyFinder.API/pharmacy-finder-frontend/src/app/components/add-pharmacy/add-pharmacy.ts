import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-pharmacy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './add-pharmacy.html',
  styleUrls: ['./add-pharmacy.css']
})
export class AddPharmacy {
  pharmacyForm: FormGroup;
  private apiUrl = 'http://localhost:5067/api/Pharmacy'; 

  constructor(private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar) {
    this.pharmacyForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      contact: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      latitude: [0],
      longitude: [0],
      operatingHours: ['', Validators.required],
      ownerId: ['', Validators.required]
    });
  }


submit(): void {
  if(this.pharmacyForm.invalid) {
  this.showError('Please fill in all required fields.');
  return;
}

const token = localStorage.getItem('token');
if (!token) {
  this.showError('User not authenticated.');
  return;
}


const headers = new HttpHeaders({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
});


const payload = {
  name: this.pharmacyForm.value.name,
  address: this.pharmacyForm.value.address,
  contact: this.pharmacyForm.value.contact,
  licenseNumber: this.pharmacyForm.value.licenseNumber,
  latitude: this.pharmacyForm.value.latitude,
  longitude: this.pharmacyForm.value.longitude,
  operatingHours: this.pharmacyForm.value.operatingHours,
  ownerId: this.pharmacyForm.value.ownerId
};

this.http.post(this.apiUrl, payload, { headers, observe: 'response' }).subscribe({
  next: (res) => {
    if (res.status === 201 || res.status === 200) {
      this.showSuccess('Pharmacy added successfully. Approval pending.');
      this.pharmacyForm.reset();
    } else {
      this.showError('Unexpected server response.');
    }
  },
  error: (err) => {
    console.error('Error:', err);
    if (err.status === 400) {
      this.showError(err.error || 'Bad request. Check Owner ID.');
    } else if (err.status === 401) {
      this.showError('Unauthorized — make sure you are logged in as Admin.');
    } else {
      this.showError('Failed to add pharmacy. Try again later.');
    }
  }
});
}


  private showSuccess(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  private showError(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 4000, panelClass: ['error-snackbar'] });
  }
}
