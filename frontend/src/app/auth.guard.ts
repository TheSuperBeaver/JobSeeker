import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');
    const expiration = localStorage.getItem('tokenExpiration');

    if (token && expiration && Date.now() < +expiration) {
      return true;
    } else {
      this.router.navigate(['login']);
      localStorage.removeItem('accessToken')
      localStorage.removeItem('tokenExpiration')
      return false;
    }
  }
}
