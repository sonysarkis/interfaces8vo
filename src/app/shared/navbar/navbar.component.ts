import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <a (click)="scrollToSection('inicio')" class="logo-text">
            Landing
          </a>
        </div>
        <div class="nav-links">
          <a (click)="scrollToSection('inicio')">Inicio</a>
          <a (click)="scrollToSection('servicios')">Servicios</a>
          <a (click)="scrollToSection('contacto')">Contacto</a>
          <a (click)="scrollToSection('beneficios')">Beneficios</a>
          <ng-container *ngIf="!isLoggedIn; else logged">
            <a routerLink="/login" routerLinkActive="active">Iniciar Sesión</a>
            <a routerLink="/registro" routerLinkActive="active">Registrarse</a>
          </ng-container>
          <ng-template #logged>
            <a routerLink="/personalization" routerLinkActive="active">Personalización</a>
            <button class="logout-btn" (click)="onLogoutClick()">Cerrar sesión</button>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: var(--color-background);
      box-shadow: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-text {
      font-size: var(--font-title-size);
      font-family: var(--font-title-family);
      font-weight: var(--font-title-weight);
      color: var(--color-primary);
      text-decoration: none;
      cursor: pointer;
      transition: color 0.2s;
    }

    .logo-text:hover {
      color: var(--color-accent);
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
    }

    .nav-links a, .nav-links button {
      color: var(--color-text);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
      cursor: pointer;
      font-family: var(--font-body-family);
      font-size: var(--font-body-size);
      background: none;
      border: none;
      padding: 0;
    }

    .nav-links a:hover, .nav-links button:hover {
      color: var(--color-accent);
    }

    .nav-links a.active {
      color: var(--color-secondary);
    }

    .logout-btn {
      color: var(--color-text);
      font-weight: 500;
      background: none;
      border: none;
      cursor: pointer;
      font-family: var(--font-body-family);
      font-size: var(--font-body-size);
      transition: color 0.2s;
    }

    .logout-btn:hover {
      color: var(--color-accent);
    }

    @media (max-width: 768px) {
      .navbar-container {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-links {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
    }
  `]
})
export class NavbarComponent {
  @Output() logout = new EventEmitter<void>();
  isLoggedIn = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkLogin();
    window.addEventListener('storage', () => this.checkLogin());
  }

  checkLogin() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  onLogoutClick() {
    this.logout.emit();
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}