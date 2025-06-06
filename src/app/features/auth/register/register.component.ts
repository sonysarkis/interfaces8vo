import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas comunes de Angular
import { RouterModule } from '@angular/router'; // Necesario para `routerLink`
import { FormsModule } from '@angular/forms'; // Necesario para `[(ngModel)]`

@Component({
  selector: 'app-register',
  standalone: true, // ¡Esta es la clave para que sea un componente standalone!
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear una cuenta
          </h2>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="name" class="sr-only">Nombre completo</label>
              <input id="name" name="name" type="text" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nombre completo" [(ngModel)]="name">
            </div>
            <div>
              <label for="email" class="sr-only">Correo electrónico</label>
              <input id="email" name="email" type="email" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico" [(ngModel)]="email">
            </div>
            <div>
              <label for="password" class="sr-only">Contraseña</label>
              <input id="password" name="password" type="password" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña" [(ngModel)]="password">
            </div>
            <div>
              <label for="confirmPassword" class="sr-only">Confirmar contraseña</label>
              <input id="confirmPassword" name="confirmPassword" type="password" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar contraseña" [(ngModel)]="confirmPassword">
            </div>
          </div>

          <div>
            <button type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Registrarse
            </button>
          </div>
        </form>
        <div class="text-center">
          <a routerLink="/login" class="font-medium text-blue-600 hover:text-blue-500">
            ¿Ya tienes una cuenta? Inicia sesión
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor() { }

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    console.log('Register attempt:', {
      name: this.name,
      email: this.email,
      password: this.password
    });
    // Aquí iría la lógica para enviar los datos de registro a un servicio
  }
}