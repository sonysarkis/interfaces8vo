import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-carousel',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="relative">
          <div class="overflow-hidden">
            <div class="flex transition-transform duration-500 ease-in-out">
              <div class="w-full flex-shrink-0">
                <div class="bg-gray-100 p-8 rounded-lg">
                  <h3 class="text-2xl font-bold mb-4">Transforma tu Negocio</h3>
                  <p class="text-gray-600 mb-6">Descubre cómo podemos ayudarte a alcanzar tus objetivos digitales.</p>
                  <button class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    Saber más
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  `
})
export class CarouselComponent { } 