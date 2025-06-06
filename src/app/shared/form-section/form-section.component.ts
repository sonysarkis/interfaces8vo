import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="form-section">
      <div class="form-container">
        <h2>Contáctanos</h2>
        <p class="subtitle">¿Tienes alguna pregunta? Estamos aquí para ayudarte.</p>
        
        <form (ngSubmit)="onSubmit()" #contactForm="ngForm">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              [(ngModel)]="formData.name" 
              required
              #name="ngModel">
            <div class="error-message" *ngIf="name.invalid && (name.dirty || name.touched)">
              El nombre es requerido
            </div>
          </div>

          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="formData.email" 
              required
              email
              #email="ngModel">
            <div class="error-message" *ngIf="email.invalid && (email.dirty || email.touched)">
              Ingresa un correo electrónico válido
            </div>
          </div>

          <div class="form-group">
            <label for="message">Mensaje</label>
            <textarea 
              id="message" 
              name="message" 
              [(ngModel)]="formData.message" 
              required
              rows="5"
              #message="ngModel"></textarea>
            <div class="error-message" *ngIf="message.invalid && (message.dirty || message.touched)">
              El mensaje es requerido
            </div>
          </div>

          <button type="submit" [disabled]="contactForm.invalid">
            Enviar Mensaje
          </button>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .form-section {
      padding: 4rem 2rem;
      background-color: #f9fafb;
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
      text-align: center;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      text-align: center;
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #4b5563;
      font-weight: 500;
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #4f46e5;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button:hover:not(:disabled) {
      background-color: #4338ca;
    }

    button:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
  `]
})
export class FormSectionComponent {
  formData = {
    name: '',
    email: '',
    message: ''
  };

  onSubmit() {
    console.log('Form submitted:', this.formData);
    // Aquí iría la lógica para enviar el formulario
    alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
  }
} 