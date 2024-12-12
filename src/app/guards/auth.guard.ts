import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

 canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('AuthGuard: Is authenticated?', isAuthenticated);
    if (isAuthenticated) {
      return true;
    } else {
      console.warn('AuthGuard: Not authenticated. Redirecting to /login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}