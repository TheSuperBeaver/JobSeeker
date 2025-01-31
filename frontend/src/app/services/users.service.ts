import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { User } from '../models/users';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: User[] = [];
  private canViewOtherUsersSubject = new BehaviorSubject<boolean>(false);
  canViewOtherUsers$: Observable<boolean> = this.canViewOtherUsersSubject.asObservable();

  private readonly allowedRoles: number[] = [1, 2, 3, 5, 6, 8, 9, 10];


  constructor(private httpClient: HttpClient) {
    this.loadUsers();
    this.loadCanViewOtherUsers();
  }

  loadUsers(): Promise<void> {
    const token = localStorage.getItem('accessToken');
    const email = localStorage.getItem('email');

    if (!token || !email) {
      return Promise.resolve();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-User-Email': email
    });

    return new Promise((resolve, reject) => {
      const url = `${environment.apiUrl}users/`;

      this.httpClient.get<{ users: User[] }>(url, { headers }).subscribe({
        next: (response) => {
          this.users = response.users
          resolve();
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  async loadCanViewOtherUsers(): Promise<void> {
    const token = localStorage.getItem('accessToken');
    const email = localStorage.getItem('email');

    if (!token || !email) {
      this.canViewOtherUsersSubject.next(false);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-User-Email': email
    });

    try {

      new Promise((reject) => {
        const url = `${environment.apiUrl}user/`;

        this.httpClient.get<{ user: User }>(url, { headers }).subscribe({
          next: (response) => {
            if (response?.user.role_id) {
              const canView = response?.user?.role_id
                ? this.allowedRoles.includes(response.user.role_id)
                : false;

              this.canViewOtherUsersSubject.next(canView);
            } else {
              this.canViewOtherUsersSubject.next(false);
            }
          },
          error: (error) => {
            this.canViewOtherUsersSubject.next(false);
            reject(error);

          },
        });
      });
      this.canViewOtherUsersSubject.next(false);

    } catch (error) {
      console.error('Error fetching user role:', error);
      this.canViewOtherUsersSubject.next(false);
    }
  }
}