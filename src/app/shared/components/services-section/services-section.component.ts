import { Component } from '@angular/core';

@Component({
  selector: 'app-services-section',
  standalone: true,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-lg shadow-md border border-secondary">
        <h3 class="font-subtitle mb-3 text-primary">Servicio 1</h3>
        <p class="font-paragraph text-app-text">Ofrecemos soluciones innovadoras para tu negocio.</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md border border-secondary">
        <h3 class="font-subtitle mb-3 text-primary">Servicio 2</h3>
        <p class="font-paragraph text-app-text">Soporte técnico 24/7 para todas tus necesidades.</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md border border-secondary">
        <h3 class="font-subtitle mb-3 text-primary">Servicio 3</h3>
        <p class="font-paragraph text-app-text">Capacitaciones personalizadas para tu equipo.</p>
      </div>
    </div>
  `,
  styles: []
})
export class ServicesSectionComponent { }