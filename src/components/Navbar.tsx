import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const checkLogin = () => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setUserType(localStorage.getItem('type') || '');
  };

  useEffect(() => {
    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => {
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <span className="logo-text" onClick={() => handleNavClick('inicio')}>Landing</span>
        </div>
        <button className="hamburger" onClick={toggleMenu} aria-label="Abrir menú">
          <span className={isMenuOpen ? 'open' : ''}></span>
          <span className={isMenuOpen ? 'open' : ''}></span>
          <span className={isMenuOpen ? 'open' : ''}></span>
        </button>
        <div className={`nav-links${isMenuOpen ? ' open' : ''}`}>
          <span onClick={() => handleNavClick('inicio')}>Inicio</span>
          <span onClick={() => handleNavClick('servicios')}>Servicios</span>
          <span onClick={() => handleNavClick('contacto')}>Contacto</span>
          <span onClick={() => handleNavClick('beneficios')}>Beneficios</span>
          {!isLoggedIn ? (
            <>
              <Link to="/login" onClick={closeMenu}>Iniciar Sesión</Link>
              <Link to="/registro" onClick={closeMenu}>Registrarse</Link>
            </>
          ) : (
            <>
              {userType === 'admin' && (
                <>
                  <Link to="/personalization" onClick={closeMenu}>Personalización</Link>
                  <Link to="/usuarios" onClick={closeMenu}>Usuarios</Link>
                  <Link to="/perfil" onClick={closeMenu}>Perfil</Link>
                </>
              )}
              {userType !== 'admin' && (
                <Link to="/perfil" onClick={closeMenu}>Perfil</Link>
              )}
              <button className="logout-btn" onClick={() => { handleLogout(); closeMenu(); }}>Cerrar sesión</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 