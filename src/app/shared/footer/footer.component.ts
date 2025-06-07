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
        <p style="margin-top: 0.5rem; font-size: 0.95em;">
          Consulta nuestras <a href="#" style="text-decoration: underline; color: #4f46e5;">Políticas de Privacidad</a> y <a href="#" style="text-decoration: underline; color: #4f46e5;">Términos Legales</a>.
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #1f2937;
      color: #f9fafb;
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
      color: #f9fafb;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    .footer-section p {
      color: #d1d5db;
      line-height: 1.5;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section ul li {
      margin-bottom: 0.5rem;
    }

    .footer-section ul li a {
      color: #d1d5db;
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-section ul li a:hover {
      color: #f9fafb;
    }

    .contact-info li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #d1d5db;
    }

    .contact-info i {
      color: #4f46e5;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-links a {
      color: #d1d5db;
      font-size: 1.5rem;
      transition: color 0.2s;
    }

    .social-links a:hover {
      color: #4f46e5;
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 2rem auto 0;
      padding-top: 2rem;
      border-top: 1px solid #374151;
      text-align: center;
      color: #9ca3af;
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