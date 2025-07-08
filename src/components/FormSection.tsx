import React, { useState } from 'react';

const FormSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const isFormInvalid = !formData.name || !formData.email || !formData.message;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;
    alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="form-section">
      <div className="form-container">
        <h2>Contáctanos</h2>
        <p className="subtitle">¿Tienes alguna pregunta? Estamos aquí para ayudarte.</p>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mensaje</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={onChange}
              required
              rows={5}
            />
          </div>
          <button type="submit" disabled={isFormInvalid}>
            Enviar Mensaje
          </button>
        </form>
      </div>
    </section>
  );
};

export default FormSection; 