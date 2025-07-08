import React from 'react';

const services = [
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

const ServicesSection: React.FC = () => (
  <section className="services-section">
    <h2>Nuestros Servicios</h2>
    <div className="services-grid">
      {services.map(service => (
        <div className="service-card" key={service.title}>
          <div className="service-icon">
            <i className={service.icon}></i>
          </div>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default ServicesSection; 