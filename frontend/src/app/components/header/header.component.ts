import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showDropdown = false;

  constructor(private router: Router) { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getUserEmail(): string {
    return localStorage.getItem('email') || 'User';
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }

}
