import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="services-section">
      <h2>Nuestros Servicios</h2>
      <div class="services-grid">
        <div class="service-card" *ngFor="let service of services">
          <div class="service-icon">
            <i [class]="service.icon"></i>
          </div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .services-section {
      padding: 4rem 2rem;
      background-color: #f9fafb;
    }

    h2 {
      text-align: center;
      font-size: 2rem;
      color: #1f2937;
      margin-bottom: 3rem;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .service-card {
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.2s;
    }

    .service-card:hover {
      transform: translateY(-5px);
    }

    .service-icon {
      font-size: 2.5rem;
      color: #4f46e5;
      margin-bottom: 1rem;
    }

    h3 {
      color: #1f2937;
      margin-bottom: 1rem;
    }

    p {
      color: #6b7280;
      line-height: 1.5;
    }
  `]
})
export class ServicesSectionComponent {
  services = [
    {
      icon: 'fas fa-laptop-code',
      title: 'Desarrollo Web',
      description: 'Creamos sitios web modernos y responsivos utilizando las últimas tecnologías.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Aplicaciones Móviles',
      description: 'Desarrollamos aplicaciones móviles nativas y multiplataforma.'
    },
    {
      icon: 'fas fa-server',
      title: 'Servicios en la Nube',
      description: 'Ofrecemos soluciones de hosting y servicios en la nube escalables.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Ciberseguridad',
      description: 'Protegemos tus sistemas y datos con las mejores prácticas de seguridad.'
    }
  ];
} 