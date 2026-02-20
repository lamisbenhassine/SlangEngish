import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signUpData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as Role
  };
  hidePassword = true;
  hideConfirmPassword = true;
  agreeToTerms = false;
  avatarPreview = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  isFormValid(): boolean {
    return this.signUpData.firstName.trim() !== '' &&
           this.signUpData.lastName.trim() !== '' &&
           this.signUpData.email.trim() !== '' &&
           this.signUpData.password.trim() !== '' &&
           this.signUpData.confirmPassword.trim() !== '' &&
           this.isValidEmail(this.signUpData.email) &&
           this.signUpData.password === this.signUpData.confirmPassword &&
           this.signUpData.password.length >= 8 &&
           this.agreeToTerms;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSignUp() {
    if (this.isFormValid()) {
      const payload = {
        firstName: this.signUpData.firstName,
        lastName: this.signUpData.lastName,
        email: this.signUpData.email,
        password: this.signUpData.password,
        role: this.signUpData.role
      };

      this.authService.signup(payload).subscribe({
        next: (user) => {
          // Redirect based on role after successful signup
          if (user.role === 'ADMIN') {
            this.router.navigate(['/backoffice/users']);
          } else {
            this.router.navigate(['/frontoffice/dashboard']);
          }
        },
        error: err => {
          console.error('Signup failed', err);
          // TODO: display error message in UI
        }
      });
    }
  }
}
