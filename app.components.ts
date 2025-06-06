import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // Para que <router-outlet> funcione

// Aquí importarás los componentes que app.component.html necesite directamente.
// Si tu app.component.html solo tiene <router-outlet>, entonces solo necesitas RouterOutlet.
// Si tienes un navbar o footer fijo en app.component.html, impórtalos aquí.
// Por ejemplo:
// import { NavbarComponent } from './shared/components/navbar/navbar.component';
// import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    // NavbarComponent, // Descomentar si usas <app-navbar> directamente en app.component.html
    // FooterComponent  // Descomentar si usas <app-footer> directamente en app.component.html
  ],
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.component.scss' // o .css
})
export class AppComponent {
  title = 'my-custom-app';
}