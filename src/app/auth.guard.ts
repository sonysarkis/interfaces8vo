import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
    if (!token) {
      return this.router.createUrlTree(['/']);
    }
    try {
      const res = await fetch('/admin-auth/auth', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.valid) {
        return true;
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        return this.router.createUrlTree(['/']);
      }
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      return this.router.createUrlTree(['/']);
    }
  }
}