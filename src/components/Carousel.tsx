import React, { useState, useEffect, useRef } from 'react';
import atencionCliente from '../assets/images/atencion-cliente.png';
import innovacion from '../assets/images/innovacion.png';
import equipo from '../assets/images/equipo.png';
import crecimiento from '../assets/images/crecimiento.png';
import seguridad from '../assets/images/seguridad.png';

const slides = [
  {
    image: atencionCliente,
    title: 'Atención al Cliente',
    description: 'Resolvemos tus dudas y problemas 24/7 para que nunca te detengas.'
  },
  {
    image: innovacion,
    title: 'Innovación Constante',
    description: 'Siempre implementamos las últimas tecnologías para tu empresa.'
  },
  {
    image: equipo,
    title: 'Trabajo en Equipo',
    description: 'Nuestro equipo multidisciplinario impulsa el éxito de tu proyecto.'
  },
  {
    image: crecimiento,
    title: 'Crecimiento Asegurado',
    description: 'Te ayudamos a escalar tu negocio y alcanzar nuevos mercados.'
  },
  {
    image: seguridad,
    title: 'Seguridad y Confianza',
    description: 'Protegemos tus datos y operaciones con los más altos estándares.'
  }
];

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="carousel">
      <div className="carousel-container">
        <div className="carousel-slides">
          {slides.map((slide, i) => (
            <div
              className={`slide${i === currentSlide ? ' active' : ''}`}
              key={slide.title}
              style={{ opacity: i === currentSlide ? 1 : 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transition: 'opacity 0.5s ease-in-out' }}
            >
              <img src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control prev" onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="carousel-control next" onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>
        <div className="carousel-indicators">
          {slides.map((slide, i) => (
            <button
              key={`indicator-${slide.title}`}
              className={i === currentSlide ? 'active' : ''}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;