import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonalizationService, StylePreset } from '../../core/services/personalization.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-personalization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="personalization-container">
      <h2>Personalización de la Aplicación</h2>

      <div class="color-section">
        <h3>Colores</h3>
        <div class="color-options">
          <div class="color-option" *ngFor="let color of colors">
            <div class="color-preview" [style.background-color]="color.value"></div>
            <span>{{ color.name }}</span>
            <input type="color" [(ngModel)]="color.value" (change)="updateColor(color.type, color.value)">
          </div>
        </div>
      </div>

      <div class="font-section">
        <h3>Fuentes</h3>
        <div class="font-options">
          <div class="font-option" *ngFor="let font of fonts">
            <div class="font-preview" [style.font-family]="font.value">
              {{ font.name }}
            </div>
            <select [(ngModel)]="font.value" (change)="updateFont(font.type, font.value)">
              <option value="Arial">Arial</option>
              <option value="Roboto">Roboto</option>
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
            </select>
          </div>
        </div>
      </div>

      <div class="size-section">
        <h3>Tamaños</h3>
        <div class="size-options">
          <div class="size-option" *ngFor="let size of sizes">
            <label>{{ size.name }}</label>
            <input type="range" 
                   [min]="size.min" 
                   [max]="size.max" 
                   [(ngModel)]="size.value"
                   (input)="updateSize(size.type, size.value)">
            <span>{{ size.value }}px</span>
          </div>
        </div>
      </div>

      <div class="presets-section">
        <h3>Presets</h3>
        <div class="preset-options">
          <div class="preset-card" *ngFor="let preset of presets" (click)="applyPreset(preset.styles)">
            <h4>{{ preset.name }}</h4>
            <p>{{ preset.description }}</p>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="save-button" (click)="saveChanges()">Guardar Cambios</button>
        <button class="reset-button" (click)="resetChanges()">Restablecer</button>
      </div>
    </div>
  `,
  styles: [`
    .personalization-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #1f2937;
    }

    h3 {
      color: #4b5563;
      margin-bottom: 1rem;
    }

    .color-section,
    .font-section,
    .size-section,
    .presets-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .color-options,
    .font-options,
    .size-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .color-option,
    .font-option,
    .size-option {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .color-preview {
      width: 100%;
      height: 40px;
      border-radius: 0.25rem;
      border: 1px solid #e5e7eb;
    }

    .font-preview {
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.25rem;
      text-align: center;
    }

    input[type="color"] {
      width: 100%;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: 0.25rem;
    }

    select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.25rem;
    }

    input[type="range"] {
      width: 100%;
    }

    .preset-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .preset-card {
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .preset-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.25rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .save-button {
      background-color: #4f46e5;
      color: white;
    }

    .save-button:hover {
      background-color: #4338ca;
    }

    .reset-button {
      background-color: #ef4444;
      color: white;
    }

    .reset-button:hover {
      background-color: #dc2626;
    }
  `]
})
export class PersonalizationComponent implements OnInit, OnDestroy {
  colors = [
    { name: 'Primario', type: 'primary', value: '#4f46e5' },
    { name: 'Secundario', type: 'secondary', value: '#6366f1' },
    { name: 'Acento', type: 'accent', value: '#818cf8' },
    { name: 'Fondo', type: 'background', value: '#ffffff' },
    { name: 'Texto', type: 'text', value: '#000000' }
  ];

  fonts = [
    { name: 'Título', type: 'title', value: 'Inter' },
    { name: 'Subtítulo', type: 'subtitle', value: 'Roboto' },
    { name: 'Párrafo', type: 'paragraph', value: 'Arial' }
  ];

  sizes = [
    { name: 'Título', type: 'title', value: 24, min: 16, max: 48 },
    { name: 'Subtítulo', type: 'subtitle', value: 18, min: 14, max: 32 },
    { name: 'Párrafo', type: 'paragraph', value: 14, min: 12, max: 24 }
  ];

  presets = [
    {
      name: 'Clásico',
      description: 'Diseño tradicional con colores sobrios',
      styles: {
        colors: {
          primary: '#2c3e50',
          secondary: '#34495e',
          accent: '#3498db',
          background: '#ffffff',
          text: '#2c3e50'
        },
        fonts: {
          title: {
            family: 'Georgia',
            size: '24px',
            color: '#2c3e50'
          },
          subtitle: {
            family: 'Arial',
            size: '18px',
            color: '#2c3e50'
          },
          paragraph: {
            family: 'Arial',
            size: '14px',
            color: '#2c3e50'
          }
        }
      }
    },
    {
      name: 'Moderno',
      description: 'Estilo contemporáneo con colores vibrantes',
      styles: {
        colors: {
          primary: '#4f46e5',
          secondary: '#6366f1',
          accent: '#818cf8',
          background: '#ffffff',
          text: '#1f2937'
        },
        fonts: {
          title: {
            family: 'Inter',
            size: '28px',
            color: '#1f2937'
          },
          subtitle: {
            family: 'Roboto',
            size: '20px',
            color: '#1f2937'
          },
          paragraph: {
            family: 'Inter',
            size: '16px',
            color: '#1f2937'
          }
        }
      }
    }
  ];

  private subscription: Subscription = new Subscription();

  constructor(private personalizationService: PersonalizationService) { }

  ngOnInit() {
    this.subscription.add(
      this.personalizationService.currentStyles$.subscribe(styles => {
        this.updateControlsFromStyles(styles);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateColor(type: string, value: string) {
    this.personalizationService.updateColor(type, value);
  }

  updateFont(type: string, value: string) {
    this.personalizationService.updateFont(type, value);
  }

  updateSize(type: string, value: number) {
    this.personalizationService.updateSize(type, value);
  }

  applyPreset(styles: StylePreset) {
    this.personalizationService.applyPreset(styles);
  }

  saveChanges() {
    this.personalizationService.saveChanges();
  }

  resetChanges() {
    this.personalizationService.resetChanges();
  }

  private updateControlsFromStyles(styles: StylePreset) {
    // Actualizar colores
    this.colors = this.colors.map(color => ({
      ...color,
      value: styles.colors[color.type as keyof typeof styles.colors] || color.value
    }));

    // Actualizar fuentes
    this.fonts = this.fonts.map(font => ({
      ...font,
      value: styles.fonts[font.type as keyof typeof styles.fonts].family || font.value
    }));

    // Actualizar tamaños
    this.sizes = this.sizes.map(size => ({
      ...size,
      value: parseInt(styles.fonts[size.type as keyof typeof styles.fonts].size) || size.value
    }));
  }
}