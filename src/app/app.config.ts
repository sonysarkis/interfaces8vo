import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Asumo que tus rutas ya están importadas aquí
import { FormsModule } from '@angular/forms'; // <-- Importa FormsModule
import { HttpClientModule } from '@angular/common/http'; // <-- Opcional, si usarás HttpClient

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Agrega FormsModule y HttpClientModule a los providers
    FormsModule,       // Para [(ngModel)]
    HttpClientModule   // Si planeas usar HttpClient
  ]
};