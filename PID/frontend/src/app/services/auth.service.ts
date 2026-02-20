import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import type { Role } from './user.service';

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export interface SigninPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8011/api/auth';

  // Simple in-memory current user (pas de localStorage pour éviter les erreurs SSR)
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private setCurrentUser(user: AuthUser | null): void {
    this.currentUserSubject.next(user);
  }

  signup(payload: SignupPayload): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/signup`, payload).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  signin(payload: SigninPayload): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/signin`, payload).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  signout(): void {
    this.setCurrentUser(null);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  getLoginTime(): string | null {
    return null;
  }
}

