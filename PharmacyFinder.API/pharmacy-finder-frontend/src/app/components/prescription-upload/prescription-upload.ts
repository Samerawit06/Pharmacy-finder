import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface MedicineResult {
  medicineName: string;
  pharmacyName: string;
  address: string;
  phone?: string;
  email?: string;
  price: number;
  isApproved: boolean;
}
interface UploadResponse {
  extractedText: string;
  foundMedicines: MedicineResult[];
}

@Component({
  selector: 'app-prescription-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './prescription-upload.html',
  styleUrls: ['./prescription-upload.css']
})

export class PrescriptionUpload{
  selectedFile: File | null = null;
  isUploading: boolean = false;
  isDragOver: boolean = false;
  uploadResult: UploadResponse | null = null;

  private apiUrl = 'http://localhost:5067/api/Pharmacy/UploadImage';

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  private validateAndSetFile(file: File): void {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      this.showError('Please select a valid image file (JPG, PNG, JPEG)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.showError('File size too large. Please select an image smaller than 10MB.');
      return;
    }

    this.selectedFile = file;
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
  }

  uploadPrescription(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadResult = null;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post<UploadResponse>(this.apiUrl, formData).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.uploadResult = response;
        this.showSuccess('Prescription processed successfully!');
      },
      error: (error) => {
        this.isUploading = false;
        console.error('Upload error:', error);
        this.showError('Failed to process prescription. Please try again.');
      }
    });
  }

  uploadAnother(): void {
    this.selectedFile = null;
    this.uploadResult = null;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}

