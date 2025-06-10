import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2'; // Agrega esta línea

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-primary">
            Iniciar Sesión
          </h2>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Correo electrónico</label>
              <input id="email" name="email" type="email" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-text placeholder-text text-primary rounded-t-md focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                placeholder="Correo electrónico" [(ngModel)]="email">
            </div>
            <div>
              <label for="password" class="sr-only">Contraseña</label>
              <input id="password" name="password" type="password" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-text placeholder-text text-primary rounded-b-md focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                placeholder="Contraseña" [(ngModel)]="password">
            </div>
          </div>

          <div>
            <button type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-background bg-secondary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
              Iniciar Sesión
            </button>
          </div>
        </form>
        <div class="text-center">
          <a routerLink="/registro" class="font-medium text-secondary hover:text-accent">
            ¿No tienes una cuenta? Regístrate aquí
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: var(--font-body-family);
    }

    h2 {
      font-family: var(--font-title-family);
      font-size: var(--font-title-size);
      font-weight: var(--font-title-weight);
    }

    input {
      font-family: var(--font-body-family);
      font-size: var(--font-body-size);
    }

    button {
      font-family: var(--font-body-family);
      font-size: var(--font-body-size);
      font-weight: var(--font-body-weight);
    }

    a {
      font-family: var(--font-body-family);
      font-size: var(--font-body-size);
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  async onSubmit() {
    const token = localStorage.getItem('token') || '';
    console.log('Token:', token);
    try {
      const res = await fetch('/admin-auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: this.email, password: this.password })
      });
      const data = await res.json();
      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error?.error || data.error || JSON.stringify(data)
        });
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      await Swal.fire({
        icon: 'success',
        title: 'Login exitoso',
        text: 'Has iniciado sesión correctamente.'
      });
      this.router.navigate(['/personalization']);
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error de red o del servidor'
      });
    }
  }
}