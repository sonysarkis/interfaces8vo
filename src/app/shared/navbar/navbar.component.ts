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
          <a (click)="handleNavClick('inicio')" class="logo-text">
            Landing
          </a>
        </div>
        <button class="hamburger" (click)="toggleMenu()" aria-label="Abrir menú" *ngIf="true">
          <span [class.open]="isMenuOpen"></span>
          <span [class.open]="isMenuOpen"></span>
          <span [class.open]="isMenuOpen"></span>
        </button>
        <div class="nav-links" [class.open]="isMenuOpen">
          <a (click)="handleNavClick('inicio')">Inicio</a>
          <a (click)="handleNavClick('servicios')">Servicios</a>
          <a (click)="handleNavClick('contacto')">Contacto</a>
          <a (click)="handleNavClick('beneficios')">Beneficios</a>
          <ng-container *ngIf="!isLoggedIn; else logged">
            <a routerLink="/login" routerLinkActive="active" (click)="closeMenu()">Iniciar Sesión</a>
            <a routerLink="/registro" routerLinkActive="active" (click)="closeMenu()">Registrarse</a>
          </ng-container>
          <ng-template #logged>
            <a routerLink="/personalization" routerLinkActive="active" (click)="closeMenu()">Personalización</a>
            <button class="logout-btn" (click)="onLogoutClick(); closeMenu()">Cerrar sesión</button>
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
      position: relative;
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
      transition: all 0.3s;
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

    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      background: none;
      border: none;
      cursor: pointer;
      z-index: 1100;
    }
    .hamburger span {
      display: block;
      width: 28px;
      height: 4px;
      margin: 4px 0;
      background: var(--color-primary);
      border-radius: 2px;
      transition: 0.4s;
    }
    .hamburger span.open:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    .hamburger span.open:nth-child(2) {
      opacity: 0;
    }
    .hamburger span.open:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }

    @media (max-width: 900px) {
      .hamburger {
        display: flex;
      }
      .nav-links {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--color-background);
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        padding: 2rem 0 1rem 0;
        display: none;
        box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      }
      .nav-links.open {
        display: flex;
      }
    }
  `]
})
export class NavbarComponent {
  @Output() logout = new EventEmitter<void>();
  isLoggedIn = false;
  isMenuOpen = false;

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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  handleNavClick(sectionId: string) {
    this.scrollToSection(sectionId);
    this.closeMenu();
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}