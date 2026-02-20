import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService, User } from '../../services/user.service';
import { AddUserDialogComponent } from './add-user-dialog.component';
import { EditUserDialogComponent } from './edit-user-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedRole: string = 'all';
  selectedStatus: string = 'all';

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users.map((u) => ({
          ...u,
          status: 'active',
          joinDate: '',
          lastActive: '',
          avatar: `https://via.placeholder.com/40x40/667eea/ffffff?text=${u.firstName.charAt(0)}${u.lastName.charAt(0)}`
        }));
        this.filteredUsers = [...this.users];
      },
      error: (err) => {
        console.error('Failed to load users', err);
      }
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = this.searchTerm === '' || 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = this.selectedRole === 'all' || user.role === this.selectedRole;
      const matchesStatus = this.selectedStatus === 'all' || user.status === this.selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  onSearch(): void {
    this.filterUsers();
  }

  onRoleChange(): void {
    this.filterUsers();
  }

  onStatusChange(): void {
    this.filterUsers();
  }

  getStatusClass(status: string | undefined): string {
    return `status-badge ${status ?? 'active'}`;
  }

  getRoleClass(role: string | undefined): string {
    return `role-badge ${(role ?? '').toLowerCase()}`;
  }

  editUser(user: User): void {
    if (!user.id) {
      return;
    }

    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '600px',
      disableClose: true,
      data: user
    });

    dialogRef.afterClosed().subscribe((result: User | undefined) => {
      if (result) {
        this.loadUsers();
        this.snackBar.open('User updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  deleteUser(user: User): void {
    if (!user.id) {
      return;
    }
    this.userService.delete(user.id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to delete user', err);
      }
    });
  }

  viewUser(user: User): void {
    console.log('View user:', user);
  }

  addUser(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: User | undefined) => {
      if (result) {
        this.loadUsers();
        this.snackBar.open('User added successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }
}
