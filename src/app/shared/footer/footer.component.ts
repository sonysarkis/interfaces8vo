import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Sobre Nosotros</h3>
          <p>Somos una empresa dedicada a proporcionar soluciones tecnológicas innovadoras para impulsar el crecimiento de tu negocio.</p>
        </div>

        <div class="footer-section">
          <h3>Contacto</h3>
          <ul class="contact-info">
            <li>
              <i class="fas fa-map-marker-alt"></i>
              <span>Av. Principal 123, Ciudad</span>
            </li>
            <li>
              <i class="fas fa-phone"></i>
              <span>+1 234 567 890</span>
            </li>
            <li>
              <i class="fas fa-envelope"></i>
              <span>info&#64;empresa.com</span>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Síguenos</h3>
          <div class="social-links">
            <a href="#" target="_blank"><i class="fab fa-facebook"></i></a>
            <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
            <a href="#" target="_blank"><i class="fab fa-linkedin"></i></a>
            <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2024 Tu Empresa. Todos los derechos reservados.</p>
        <p class="legal-links">
          Consulta nuestras <a href="#">Políticas de Privacidad</a> y <a href="#">Términos Legales</a>.
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--color-primary);
      color: var(--color-background);
      padding: 4rem 2rem 1rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      justify-items: center;
      text-align: center;
    }

    .footer-section h3 {
      color: var(--color-background);
      margin-bottom: 1rem;
      font-size: var(--font-subtitle-size);
      font-family: var(--font-subtitle-family);
      font-weight: var(--font-subtitle-weight);
    }

    .footer-section p {
      color: var(--color-background);
      line-height: 1.5;
      font-family: var(--font-body-family);
      font-size: var(--font-body-size);
      font-weight: var(--font-body-weight);
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section ul li {
      margin-bottom: 0.5rem;
      font-family: var(--font-body-family);
      font-size: var(--font-body-size);
    }

    .footer-section ul li a {
      color: var(--color-background);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-section ul li a:hover {
      color: var(--color-accent);
    }

    .contact-info li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-background);
    }

    .contact-info i {
      color: var(--color-secondary);
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-links a {
      color: var(--color-background);
      font-size: 1.5rem;
      transition: color 0.2s;
    }

    .social-links a:hover {
      color: var(--color-accent);
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 2rem auto 0;
      padding-top: 2rem;
      border-top: 1px solid var(--color-secondary);
      text-align: center;
      color: var(--color-background);
      font-family: var(--font-body-family);
      font-size: var(--font-body-size);
    }

    .legal-links {
      margin-top: 0.5rem;
      font-size: 0.95em;
    }

    .legal-links a {
      color: var(--color-secondary);
      text-decoration: underline;
      transition: color 0.2s;
    }

    .legal-links a:hover {
      color: var(--color-accent);
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
      }

      .footer-section {
        text-align: center;
      }

      .contact-info li {
        justify-content: center;
      }

      .social-links {
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent { } 