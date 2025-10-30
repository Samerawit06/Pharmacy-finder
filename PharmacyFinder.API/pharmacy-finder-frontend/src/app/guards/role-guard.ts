import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as string[];
    const userRole = this.authService.getUserRole();

    if (!allowedRoles.includes(userRole)) {
      // Redirect user to their dashboard
      switch (userRole) {
        case 'Admin': this.router.navigate(['/dashboard/admin']); break;
        case 'Owner': this.router.navigate(['/dashboard/owner']); break;
        case 'Customer': this.router.navigate(['/dashboard/customer']); break;
        default: this.router.navigate(['/login']); break;
      }
      return false;
    }
    return true;
  }
}
