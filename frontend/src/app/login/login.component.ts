import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.http.post(`${environment.authUrl}`, loginData).subscribe({
        next: (response: any) => {

          const expirationTime = Date.now() + response.expiresIn;

          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('tokenExpiration', expirationTime.toString());
          localStorage.setItem('email', loginData.email);
          this.router.navigate(['jobs']);
        },
        error: () => {
          alert('Invalid email or password. Please try again.');
        },
      });
    }
  }
}
