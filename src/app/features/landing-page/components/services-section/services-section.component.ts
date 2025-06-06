import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-services-section',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4">Diseño Web</h3>
            <p class="text-gray-600">Creamos sitios web modernos y responsivos que se adaptan a tus necesidades.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4">Desarrollo de Aplicaciones</h3>
            <p class="text-gray-600">Desarrollamos aplicaciones web y móviles personalizadas para tu negocio.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4">Consultoría</h3>
            <p class="text-gray-600">Te ayudamos a optimizar tu presencia digital y mejorar tu estrategia online.</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ServicesSectionComponent { } 