import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import ServicesSection from '../components/ServicesSection';
import Carousel from '../components/Carousel';
import FormSection from '../components/FormSection';
import Footer from '../components/Footer';
import Tangram from '../tangram/tangram.tsx';

const LandingPage: React.FC = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Revisar si el loader está activado en localStorage (por defecto true)
    const loaderSetting = localStorage.getItem('showTangramLoader');
    if (loaderSetting === null || loaderSetting === 'true') {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, []);

  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShowLoader(false), 1000); // 1s para el fade
      }, 10000); // 10 segundos
      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  const logout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
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
  };

  return (
    <>
      {showLoader && (
        <div className={`tangram-loader${fadeOut ? ' fade-out' : ''}`}>
          <Tangram />
        </div>
      )}
      <Navbar onLogout={logout} />
      <main>
        <section id="inicio" className="hero">
          <div className="hero-content">
            <h1>Bienvenido a Nuestra Plataforma</h1>
            <p>Descubre soluciones innovadoras para tu negocio</p>
            <button className="cta-button">Comenzar Ahora</button>
          </div>
        </section>
        <section id="servicios">
          <ServicesSection />
        </section>
        <section id="beneficios" className="benefits-section">
          <div className="section-content">
            <h2 className="benefits-title">Beneficios</h2>
            <Carousel />
          </div>
        </section>
        <section id="contacto">
          <FormSection />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;