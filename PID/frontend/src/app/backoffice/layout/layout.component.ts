import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '../../shared/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  username = 'User';
  userAvatar = '';

  backofficeMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', routerLink: '/backoffice/dashboard' },
    { id: 'users', label: 'User Management', icon: 'people', routerLink: '/backoffice/users' },
    { id: 'courses', label: 'Course Management', icon: 'school', routerLink: '/backoffice/courses' },
    { id: 'clubs', label: 'Club Management', icon: 'groups', routerLink: '/backoffice/clubs' },
    { id: 'reports', label: 'Reports', icon: 'assessment', routerLink: '/backoffice/reports' },
    { id: 'settings', label: 'Settings', icon: 'settings', routerLink: '/backoffice/settings' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.username = 'User';
        this.userAvatar = '';
        return;
      }
      this.username = `${user.firstName} ${user.lastName}`;
      this.userAvatar = `https://via.placeholder.com/40x40/4caf50/ffffff?text=${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onMenuItemClick(item: MenuItem) {
    this.router.navigate([item.routerLink]);
  }

  onLogout() {
    this.authService.signout();
    this.router.navigate(['/auth/signin']);
  }

  onProfile() {
    this.router.navigate(['/backoffice/profile']);
  }

  onSettings() {
    this.router.navigate(['/backoffice/settings']);
  }
}
