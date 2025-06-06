import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas comunes como *ngIf, *ngFor
import { RouterModule } from '@angular/router'; // Necesario para routerLink

@Component({
  selector: 'app-navbar',
  standalone: true, // ¡Importante!
  imports: [CommonModule, RouterModule], // Importa los módulos que usa su plantilla
  template: `
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <a routerLink="/" class="text-xl font-bold text-gray-800">Logo</a>
            </div>
          </div>
          <div class="flex items-center">
            <a routerLink="/login" class="text-gray-600 hover:text-gray-900 px-3 py-2">Iniciar Sesión</a>
            <a routerLink="/register" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Registrarse</a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent { }