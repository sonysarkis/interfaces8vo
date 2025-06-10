import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ServicesSectionComponent } from '../../shared/services-section/services-section.component';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { FormSectionComponent } from '../../shared/form-section/form-section.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    ServicesSectionComponent,
    CarouselComponent,
    FormSectionComponent,
    FooterComponent
  ],
  template: `
    <app-navbar (logout)="logout()"></app-navbar>
    
    <main>
      <section id="inicio" class="hero">
        <div class="hero-content">
          <h1>Bienvenido a Nuestra Plataforma</h1>
          <p>Descubre soluciones innovadoras para tu negocio</p>
          <button class="cta-button">Comenzar Ahora</button>
        </div>
      </section>

      <section id="servicios">
        <app-services-section></app-services-section>
      </section>

      <section id="beneficios" class="benefits-section">
        <div class="section-content">
          <h2 class="benefits-title">Beneficios</h2>
          <app-carousel></app-carousel>
        </div>
      </section>

      <section id="contacto">
        <app-form-section></app-form-section>
      </section>
    </main>

    <app-footer></app-footer>
  `,
  styles: [`
    .hero {
      height: 100vh;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: var(--color-background);
      padding: 0 1rem;
    }

    .hero-content {
      max-width: 800px;
    }

    h1 {
      font-size: var(--font-title-size);
      font-family: var(--font-title-family);
      font-weight: var(--font-title-weight);
      margin-bottom: 1rem;
      color: var(--color-background);
    }

    p {
      font-size: var(--font-body-size);
      font-family: var(--font-body-family);
      font-weight: var(--font-body-weight);
      margin-bottom: 2rem;
      color: var(--color-background);
    }

    .cta-button {
      padding: 1rem 2rem;
      font-size: var(--font-body-size);
      font-family: var(--font-body-family);
      background-color: var(--color-accent);
      color: var(--color-background);
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .cta-button:hover {
      background-color: var(--color-secondary);
    }

    section {
      scroll-margin-top: 80px;
    }

    @media (max-width: 768px) {
      .hero {
        height: auto;
        min-height: 100vh;
        padding: 2rem 0.5rem;
      }
      .hero-content {
        max-width: 100%;
      }
      h1 {
        font-size: 2rem;
      }
      p {
        font-size: 1rem;
      }
      .cta-button {
        width: 100%;
        max-width: 320px;
        padding: 1rem;
      }
    }

    .benefits-title {
      text-align: center;
      font-size: var(--font-subtitle-size);
      font-family: var(--font-subtitle-family);
      font-weight: var(--font-subtitle-weight);
      margin: 2rem 0 2rem 0;
      color: var(--color-primary);
      letter-spacing: 2px;
    }
  `]
})
export class LandingPageComponent {
  async ngOnInit() {
    const res = await fetch('/styles/confirm', {
      method: 'GET'
    });
    const data = await res.json();
    console.log(data);
    if (data.success) {
      window.location.reload();
    };
  }

  async logout() {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      await Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente.'
      });
      window.location.href = '/login';
    }
  }
}