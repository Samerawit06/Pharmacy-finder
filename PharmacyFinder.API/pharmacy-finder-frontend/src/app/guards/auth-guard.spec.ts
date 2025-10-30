import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth-guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard]
    });
  });

  it('should be created', () => {
    const guard = TestBed.inject(AuthGuard);
    expect(guard).toBeTruthy();
  });
});


//import { TestBed } from '@angular/core/testing';
//import { AuthGuard } from './auth-guard';
//import { Router } from '@angular/router';
//import { AuthService } from '../services/auth.service';

//describe('AuthGuard', () => {
//  let guard: AuthGuard;  // Remove the type if it causes issues, or use proper typing
//  let authService: AuthService;
//  let router: Router;

//  beforeEach(() => {
//    TestBed.configureTestingModule({
//      providers: [
//        AuthGuard,
//        {
//          provide: AuthService,
//          useValue: {
//            isAuthenticated: () => true
//          }
//        },
//        {
//          provide: Router,
//          useValue: {
//            navigate: jasmine.createSpy('navigate')
//          }
//        }
//      ]
//    });

//    guard = TestBed.inject(AuthGuard);
//    authService = TestBed.inject(AuthService);
//    router = TestBed.inject(Router);
//  });

//  it('should be created', () => {
//    expect(guard).toBeTruthy();
//  });
//});
