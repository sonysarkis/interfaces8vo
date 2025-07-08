import React from 'react';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section">
        <h3>Sobre Nosotros</h3>
        <p>Somos una empresa dedicada a proporcionar soluciones tecnológicas innovadoras para impulsar el crecimiento de tu negocio.</p>
      </div>
      <div className="footer-section">
        <h3>Contacto</h3>
        <ul className="contact-info">
          <li>
            <i className="fas fa-map-marker-alt"></i>
            <span>Av. Principal 123, Ciudad</span>
          </li>
          <li>
            <i className="fas fa-phone"></i>
            <span>+1 234 567 890</span>
          </li>
          <li>
            <i className="fas fa-envelope"></i>
            <span>info@empresa.com</span>
          </li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Síguenos</h3>
        <div className="social-links">
          <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
          <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
          <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
          <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2024 Tu Empresa. Todos los derechos reservados.</p>
      <p className="legal-links">
        Consulta nuestras <a href="#">Políticas de Privacidad</a> y <a href="#">Términos Legales</a>.
      </p>
    </div>
  </footer>
);

export default Footer; 