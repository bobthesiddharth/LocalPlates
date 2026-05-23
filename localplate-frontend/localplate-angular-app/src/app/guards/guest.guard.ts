import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    // Allow access only when NOT logged in. If logged in, redirect to dashboard.
    if (!this.auth.isLoggedIn()) {
      return true;
    }
    return this.router.createUrlTree(['/dashboard']);
  }
}

