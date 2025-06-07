import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ServicesSectionComponent } from '../../shared/services-section/services-section.component';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { FormSectionComponent } from '../../shared/form-section/form-section.component';
import { FooterComponent } from '../../shared/footer/footer.component';

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
    <app-navbar></app-navbar>
    
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
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      padding: 0 1rem;
    }

    .hero-content {
      max-width: 800px;
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
    }

    .cta-button {
      padding: 1rem 2rem;
      font-size: 1.125rem;
      background-color: #4f46e5;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .cta-button:hover {
      background-color: #4338ca;
    }

    section {
      scroll-margin-top: 80px; /* Ajusta este valor según la altura de tu navbar */
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }
    }

    .benefits-title {
      text-align: center;
      font-size: 2.5rem;
      font-weight: bold;
      margin: 2rem 0 2rem 0;
      color: #4f46e5;
      letter-spacing: 2px;
    }
  `]
})
export class LandingPageComponent { }