import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  passwordData = {
    current: '',
    new: '',
    confirm: ''
  };

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const current = this.authService.getCurrentUser();
    if (!current) {
      return;
    }

    this.userService.getById(current.id).subscribe({
      next: (u) => {
        this.user = {
          ...u,
          phone: '',
          address: '',
          avatar: '',
        };
      },
      error: (err) => {
        console.error('Failed to load profile user', err);
      }
    });
  }

  saveProfile() {
    if (!this.user) {
      return;
    }
    console.log('Profile saved (local only for now):', this.user);
  }

  cancelEdit() {
    console.log('Edit cancelled');
  }

  changePassword() {
    if (this.passwordData.new !== this.passwordData.confirm) {
      console.error('Passwords do not match');
      return;
    }
    console.log('Password changed');
    this.passwordData = { current: '', new: '', confirm: '' };
  }
}
