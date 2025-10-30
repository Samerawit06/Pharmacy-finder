import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  registeredMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.registeredMessage = params['registered'] === 'true';
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData = {
        email: this.loginForm.value.email.trim().toLowerCase(),
        password: this.loginForm.value.password
      };

      console.log('Sending login request:', loginData);

      this.authService.login(loginData).subscribe({
        next: (response: LoginResponse) => {
          console.log('Login successful - full response:', response);
          this.isLoading = false;

        
          if (response.token) {
            localStorage.setItem('token', response.token);
            console.log('Token stored in localStorage:', response.token);
          } else {
            console.warn('No token in response:', response);
          }

         
          localStorage.setItem('user_email', this.loginForm.value.email);

          
          if (response.role) {
            localStorage.setItem('user_role', response.role);
          }

          
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

         
          this.navigateByRole(response);
        },
        error: (error) => {
          this.isLoading = false;
          this.handleLoginError(error);
        }
      });
    }
  }

  private navigateByRole(response: LoginResponse): void {
   
    const role = response.role || this.authService.getUserRole();
    console.log('User role detected:', role);

    switch (role) {
      case 'Admin':
        this.router.navigate(['/dashboard/admin']);
        break;
      case 'Owner':
        this.router.navigate(['/dashboard/owner']);
        break;
      case 'Customer':
        this.router.navigate(['/dashboard/customer']);
        break;
      default:
        console.warn('No role specified, navigating to default dashboard');
        this.router.navigate(['/dashboard']);
    }
  }

  private handleLoginError(error: any): void {
    console.error('Login error details:', error);

    if (error.status === 401) {
      this.errorMessage = 'Invalid email or password. Please try again.';
    } else if (error.status === 400) {
      this.errorMessage = error.error?.message || 'Invalid request. Please check your input.';
    } else if (error.status === 0) {
      this.errorMessage = 'Cannot connect to server. Please check your connection.';
    } else {
      this.errorMessage = error.error?.message || 'Login failed. Please try again.';
    }
  }

  // Debug method to check current auth state
  debugAuth(): void {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('user_email');
    const role = localStorage.getItem('user_role');

    console.log('=== AUTH DEBUG INFO ===');
    console.log('Token exists:', !!token);
    console.log('Token value:', token);
    console.log('User email:', email);
    console.log('User role:', role);
    console.log('======================');
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
