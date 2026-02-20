import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  signInData = {
    email: '',
    password: ''
  };
  hidePassword = true;
  rememberMe = false;
  isSubmitting = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  isFormValid(): boolean {
    return this.signInData.email.trim() !== '' &&
           this.signInData.password.trim() !== '' &&
           this.isValidEmail(this.signInData.email);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSignIn() {
    if (!this.isFormValid() || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.authService.signin(this.signInData).subscribe({
      next: (user) => {
        // Redirect based on role
        if (user.role === 'ADMIN' || user.role === 'CLUB_MANAGER') {
          this.router.navigate(['/backoffice/users']);
        } else {
          this.router.navigate(['/frontoffice/dashboard']);
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Signin failed', err);
        this.isSubmitting = false;
        // TODO: afficher un message d'erreur dans le template
      }
    });
  }
}
