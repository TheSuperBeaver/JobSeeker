import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('accessToken') && !!localStorage.getItem('tokenExpiration');
    if (isLoggedIn) {
      this.router.navigate(['/jobs']);
      return false;
    }
    return true;
  }
}