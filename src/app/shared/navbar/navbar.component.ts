import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <a routerLink="/">Logo</a>
        </div>
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inicio</a>
          <a routerLink="/servicios" routerLinkActive="active">Servicios</a>
          <a routerLink="/contacto" routerLinkActive="active">Contacto</a>
          <a routerLink="/personalizacion" routerLinkActive="active">Personalización</a>
          <a routerLink="/login" routerLinkActive="active">Iniciar Sesión</a>
          <a routerLink="/registro" routerLinkActive="active">Registrarse</a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

    .logo a {
      font-size: 1.5rem;
      font-weight: bold;
      color: #4f46e5;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
    }

    .nav-links a {
      color: #4b5563;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-links a:hover {
      color: #4f46e5;
    }

    .nav-links a.active {
      color: #4f46e5;
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
export class NavbarComponent { } 