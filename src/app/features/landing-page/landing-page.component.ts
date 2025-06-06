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
      <section class="hero">
        <div class="hero-content">
          <h1>Bienvenido a Nuestra Plataforma</h1>
          <p>Descubre soluciones innovadoras para tu negocio</p>
          <button class="cta-button">Comenzar Ahora</button>
        </div>
      </section>

      <app-services-section></app-services-section>
      <app-carousel></app-carousel>
      <app-form-section></app-form-section>
    </main>

    <app-footer></app-footer>
  `,
  styles: [`
    .hero {
      height: 100vh;
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                  url('/assets/images/hero-bg.jpg') center/cover;
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

    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }
    }
  `]
})
export class LandingPageComponent { }