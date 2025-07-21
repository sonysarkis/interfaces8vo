import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Tangram from '../tangram/tangram.tsx';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
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
        setTimeout(() => setShowLoader(false), 1000);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || '';
    try {
      const res = await fetch('/admin-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error && typeof data.error === 'string' && data.error.toLowerCase().includes('inactive')) {
          await Swal.fire({
            icon: 'error',
            title: 'Usuario deshabilitado',
            text: 'Su usuario ha sido deshabilitado, por favor contacte con un administrador.'
          });
          return;
        }
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error?.error || data.error || JSON.stringify(data)
        });
        return;
      }
      if (data.status && data.status === 'inactive') {
        await Swal.fire({
          icon: 'error',
          title: 'Usuario deshabilitado',
          text: 'Su usuario ha sido deshabilitado, por favor contacte con un administrador.'
        });
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('type', data.type);
      localStorage.setItem('id', data.id);
      await Swal.fire({
        icon: 'success',
        title: 'Login exitoso',
        text: 'Has iniciado sesión correctamente.'
      });
      if (data.type === 'admin') {
        navigate('/personalization');
      } else {
        navigate('/perfil');
      }
    } catch (e) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error de red o del servidor'
      });
    }
  };

  return (
    <>
      {showLoader && (
        <div className={`tangram-loader${fadeOut ? ' fade-out' : ''}`}>
          <Tangram />
        </div>
      )}
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Iniciar Sesión</h1>
          <form className="login-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Tu contraseña"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-button">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login; 