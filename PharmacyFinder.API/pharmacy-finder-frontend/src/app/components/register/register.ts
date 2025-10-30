import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, RegisterData } from '../../services/auth.service'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  roles: string[] = ['Customer', 'Admin', 'Pharmacist'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      userName: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        this.gmailValidator
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255)
      ]],
      role: ['Customer', [Validators.required]]
    });
  }

  gmailValidator(control: AbstractControl): { [key: string]: any } | null {
    const email = control.value;
    if (email && !email.toLowerCase().endsWith('@gmail.com')) {
      return { 'gmailOnly': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      
      const registerData: RegisterData = {
        userName: this.registerForm.value.userName.trim(), 
        email: this.registerForm.value.email.trim().toLowerCase(),
        password: this.registerForm.value.password,
        role: this.registerForm.value.role
      };

      console.log('Sending registration:', registerData); 

      this.authService.register(registerData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Registration successful! You can now login.';

          setTimeout(() => {
            this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.handleRegisterError(error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private handleRegisterError(error: any): void {
    if (error.status === 400) {
      if (error.error && typeof error.error === 'string' && error.error.includes('Email is already registered')) {
        this.errorMessage = 'This email is already registered. Please use a different email or login.';
      } else if (error.error && typeof error.error === 'string' && error.error.includes('Invalid email format')) {
        this.errorMessage = 'Invalid email format. Please use a @gmail.com email address.';
      } else {
        this.errorMessage = 'Invalid registration data. Please check your information.';
      }
    } else if (error.status === 409) {
      this.errorMessage = 'This email is already registered. Please use a different email.';
    } else {
      this.errorMessage = 'Registration failed. Please try again.';
    }
    console.error('Registration error:', error);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  get userName() { return this.registerForm.get('userName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get role() { return this.registerForm.get('role'); }

  shouldShowError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
