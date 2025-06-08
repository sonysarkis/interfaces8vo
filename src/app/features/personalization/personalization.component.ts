import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface SavedStyle {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    title: {
      family: string;
      size: number;
      weight: string;
    };
    subtitle: {
      family: string;
      size: number;
      weight: string;
    };
    body: {
      family: string;
      size: number;
      weight: string;
    };
  };
}

@Component({
  selector: 'app-personalization',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="h-screen bg-background flex flex-col">
      <div class="flex-none px-4 pt-4">
        <h1 class="text-3xl font-bold text-primary">Personalización</h1>
        
        <!-- Pestañas de Navegación -->
        <div class="mt-4 border-b border-text">
          <div class="flex space-x-8">
            <button 
              (click)="activeTab = 'colors'"
              [class.text-primary]="activeTab === 'colors'"
              [class.border-primary]="activeTab === 'colors'"
              class="pb-2 border-b-2 border-transparent hover:text-primary transition-colors">
              Colores
            </button>
            <button 
              (click)="activeTab = 'typography'"
              [class.text-primary]="activeTab === 'typography'"
              [class.border-primary]="activeTab === 'typography'"
              class="pb-2 border-b-2 border-transparent hover:text-primary transition-colors">
              Tipografía
            </button>
            <button 
              (click)="activeTab = 'saved'"
              [class.text-primary]="activeTab === 'saved'"
              [class.border-primary]="activeTab === 'saved'"
              class="pb-2 border-b-2 border-transparent hover:text-primary transition-colors">
              Estilos Guardados
            </button>
          </div>
        </div>
      </div>

      <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 pb-4 overflow-hidden">
        <!-- Panel de Controles -->
        <div class="overflow-y-auto pr-2 custom-scrollbar">
          <!-- Controles de Color -->
          <div *ngIf="activeTab === 'colors'" class="bg-white rounded-lg shadow-lg">
            <div class="p-4">
              <h2 class="text-xl font-semibold text-primary">Controles de Color</h2>
            </div>
            <div class="p-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-text mb-1">Color Primario</label>
                <div class="flex items-center gap-4">
                  <input type="color" [(ngModel)]="colors.primary" (change)="updateColors()"
                    class="w-16 h-10 rounded border border-text">
                  <span class="text-sm text-text">{{colors.primary}}</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-text mb-1">Color Secundario</label>
                <div class="flex items-center gap-4">
                  <input type="color" [(ngModel)]="colors.secondary" (change)="updateColors()"
                    class="w-16 h-10 rounded border border-text">
                  <span class="text-sm text-text">{{colors.secondary}}</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-text mb-1">Color de Acento</label>
                <div class="flex items-center gap-4">
                  <input type="color" [(ngModel)]="colors.accent" (change)="updateColors()"
                    class="w-16 h-10 rounded border border-text">
                  <span class="text-sm text-text">{{colors.accent}}</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-text mb-1">Color de Fondo</label>
                <div class="flex items-center gap-4">
                  <input type="color" [(ngModel)]="colors.background" (change)="updateColors()"
                    class="w-16 h-10 rounded border border-text">
                  <span class="text-sm text-text">{{colors.background}}</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-text mb-1">Color de Texto</label>
                <div class="flex items-center gap-4">
                  <input type="color" [(ngModel)]="colors.text" (change)="updateColors()"
                    class="w-16 h-10 rounded border border-text">
                  <span class="text-sm text-text">{{colors.text}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Controles de Tipografía -->
          <div *ngIf="activeTab === 'typography'" class="bg-white rounded-lg shadow-lg">
            <div class="p-4">
              <h2 class="text-xl font-semibold text-primary">Controles de Tipografía</h2>
            </div>
            
            <!-- Título -->
            <div class="p-4 border-t border-text">
              <h3 class="text-lg font-medium text-primary mb-2">Título</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Fuente</label>
                  <select [(ngModel)]="fonts.title.family" (change)="updateFonts()"
                    class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary">
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Tamaño (px)</label>
                  <div class="flex items-center gap-4">
                    <input type="range" [(ngModel)]="fonts.title.size" (change)="updateFonts()"
                      min="24" max="48" step="1"
                      class="flex-1">
                    <span class="text-sm text-text w-16">{{fonts.title.size}}px</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Peso de la Fuente</label>
                  <select [(ngModel)]="fonts.title.weight" (change)="updateFonts()"
                    class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary">
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi Bold (600)</option>
                    <option value="700">Bold (700)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Subtítulo -->
            <div class="p-4 border-t border-text">
              <h3 class="text-lg font-medium text-primary mb-2">Subtítulo</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Fuente</label>
                  <select [(ngModel)]="fonts.subtitle.family" (change)="updateFonts()"
                    class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary">
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Tamaño (px)</label>
                  <div class="flex items-center gap-4">
                    <input type="range" [(ngModel)]="fonts.subtitle.size" (change)="updateFonts()"
                      min="18" max="32" step="1"
                      class="flex-1">
                    <span class="text-sm text-text w-16">{{fonts.subtitle.size}}px</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Peso de la Fuente</label>
                  <select [(ngModel)]="fonts.subtitle.weight" (change)="updateFonts()"
                    class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary">
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi Bold (600)</option>
                    <option value="700">Bold (700)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Texto -->
            <div class="p-4 border-t border-text">
              <h3 class="text-lg font-medium text-primary mb-2">Texto</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Fuente</label>
                  <select [(ngModel)]="fonts.body.family" (change)="updateFonts()"
                    class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary">
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Tamaño (px)</label>
                  <div class="flex items-center gap-4">
                    <input type="range" [(ngModel)]="fonts.body.size" (change)="updateFonts()"
                      min="12" max="20" step="1"
                      class="flex-1">
                    <span class="text-sm text-text w-16">{{fonts.body.size}}px</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Peso de la Fuente</label>
                  <select [(ngModel)]="fonts.body.weight" (change)="updateFonts()"
                    class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary">
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi Bold (600)</option>
                    <option value="700">Bold (700)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Estilos Guardados -->
          <div *ngIf="activeTab === 'saved'" class="bg-white rounded-lg shadow-lg">
            <div class="p-4">
              <h2 class="text-xl font-semibold text-primary">Estilos Guardados</h2>
            </div>
            <div class="p-4 space-y-4">
              <!-- Formulario para guardar estilo -->
              <div class="border border-text rounded-lg p-4">
                <h3 class="text-lg font-medium text-primary mb-3">Guardar Estilo Actual</h3>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-text mb-1">Nombre del Estilo</label>
                    <input type="text" [(ngModel)]="newStyleName"
                      class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="Ej: Tema Oscuro">
                  </div>
                  <button (click)="saveCurrentStyle()"
                    class="w-full bg-primary text-background px-4 py-2 rounded hover:bg-opacity-80">
                    Guardar Estilo
                  </button>
                </div>
              </div>

              <!-- Lista de estilos guardados -->
              <div class="space-y-3">
                <h3 class="text-lg font-medium text-primary">Estilos Guardados</h3>
                <div *ngIf="savedStyles.length === 0" class="text-text text-center py-4">
                  No hay estilos guardados
                </div>
                <div *ngFor="let style of savedStyles" 
                  class="border border-text rounded-lg p-4 space-y-3">
                  <div class="flex justify-between items-center">
                    <h4 class="font-medium text-primary">{{style.name}}</h4>
                    <div class="flex gap-2">
                      <button (click)="applyStyle(style)"
                        class="px-3 py-1 bg-secondary text-background rounded hover:bg-opacity-80 text-sm">
                        Aplicar
                      </button>
                      <button (click)="deleteStyle(style.id)"
                        class="px-3 py-1 bg-accent text-background rounded hover:bg-opacity-80 text-sm">
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div class="grid grid-cols-5 gap-2">
                    <div class="h-8 rounded" [style.background-color]="style.colors.primary"></div>
                    <div class="h-8 rounded" [style.background-color]="style.colors.secondary"></div>
                    <div class="h-8 rounded" [style.background-color]="style.colors.accent"></div>
                    <div class="h-8 rounded" [style.background-color]="style.colors.background"></div>
                    <div class="h-8 rounded" [style.background-color]="style.colors.text"></div>
                  </div>
                  <div class="text-sm text-text">
                    <div>Fuente Principal: {{style.fonts.title.family}}</div>
                    <div>Tamaño Base: {{style.fonts.body.size}}px</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel de Vista Previa -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div class="p-4 border-b border-text">
            <h2 class="text-xl font-semibold text-primary">Vista Previa</h2>
          </div>
          <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <!-- Tipografía -->
            <div class="mb-6">
              <h3 class="text-lg font-medium text-primary mb-3">Tipografía</h3>
              <div class="space-y-4">
                <div>
                  <h1 [style.font-family]="fonts.title.family"
                      [style.font-size.px]="fonts.title.size"
                      [style.font-weight]="fonts.title.weight"
                      class="text-primary">
                    Título Principal
                  </h1>
                  <p class="text-sm text-text mt-1">
                    Fuente: {{fonts.title.family}} | Tamaño: {{fonts.title.size}}px | Peso: {{fonts.title.weight}}
                  </p>
                </div>
                <div>
                  <h2 [style.font-family]="fonts.subtitle.family"
                      [style.font-size.px]="fonts.subtitle.size"
                      [style.font-weight]="fonts.subtitle.weight"
                      class="text-primary">
                    Subtítulo
                  </h2>
                  <p class="text-sm text-text mt-1">
                    Fuente: {{fonts.subtitle.family}} | Tamaño: {{fonts.subtitle.size}}px | Peso: {{fonts.subtitle.weight}}
                  </p>
                </div>
                <div>
                  <p [style.font-family]="fonts.body.family"
                     [style.font-size.px]="fonts.body.size"
                     [style.font-weight]="fonts.body.weight"
                     class="text-text">
                    Este es un párrafo de texto normal. Aquí puedes ver cómo se ve el texto con la fuente, tamaño y peso seleccionados.
                  </p>
                  <p class="text-sm text-text mt-1">
                    Fuente: {{fonts.body.family}} | Tamaño: {{fonts.body.size}}px | Peso: {{fonts.body.weight}}
                  </p>
                </div>
              </div>
            </div>

            <!-- Componentes -->
            <div class="space-y-6">
              <!-- Navbar -->
              <div>
                <h3 class="text-lg font-medium text-primary mb-3">Navbar</h3>
                <nav class="bg-primary p-4 rounded-lg">
                  <div class="flex justify-between items-center">
                    <div class="text-background font-bold">Logo</div>
                    <div class="flex space-x-4">
                      <a class="text-background hover:text-accent">Inicio</a>
                      <a class="text-background hover:text-accent">Servicios</a>
                      <button class="bg-accent text-background px-4 py-2 rounded hover:bg-opacity-80">
                        Login
                      </button>
                    </div>
                  </div>
                </nav>
              </div>

              <!-- Botones -->
              <div>
                <h3 class="text-lg font-medium text-primary mb-3">Botones</h3>
                <div class="flex flex-wrap gap-4">
                  <button class="bg-primary text-background px-4 py-2 rounded hover:bg-opacity-80">
                    Botón Primario
                  </button>
                  <button class="bg-secondary text-background px-4 py-2 rounded hover:bg-opacity-80">
                    Botón Secundario
                  </button>
                  <button class="bg-accent text-background px-4 py-2 rounded hover:bg-opacity-80">
                    Botón de Acento
                  </button>
                </div>
              </div>

              <!-- Formulario -->
              <div>
                <h3 class="text-lg font-medium text-primary mb-3">Formulario</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-text mb-1">Campo de Texto</label>
                    <input type="text" 
                      class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="Escribe algo...">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-text mb-1">Área de Texto</label>
                    <textarea 
                      class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                      rows="3"
                      placeholder="Escribe un mensaje..."></textarea>
                  </div>
                </div>
              </div>

              <!-- Tarjetas -->
              <div>
                <h3 class="text-lg font-medium text-primary mb-3">Tarjetas</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="border border-text rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-primary mb-2">Tarjeta de Contenido</h3>
                    <p class="text-text">Este es un ejemplo de cómo se verá el contenido en una tarjeta con los colores seleccionados.</p>
                  </div>
                  <div class="bg-primary rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-background mb-2">Tarjeta Invertida</h3>
                    <p class="text-background">Esta tarjeta usa el color primario como fondo y texto claro.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  `]
})
export class PersonalizationComponent {
  activeTab: 'colors' | 'typography' | 'saved' = 'colors';
  newStyleName: string = '';
  savedStyles: SavedStyle[] = [];

  colors = {
    primary: '#2C3E50',
    secondary: '#3498DB',
    accent: '#E74C3C',
    background: '#ECF0F1',
    text: '#95A5A6'
  };

  fonts = {
    title: {
      family: 'Inter',
      size: 36,
      weight: '700'
    },
    subtitle: {
      family: 'Inter',
      size: 24,
      weight: '600'
    },
    body: {
      family: 'Inter',
      size: 16,
      weight: '400'
    }
  };

  updateColors() {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', this.colors.primary);
    root.style.setProperty('--color-secondary', this.colors.secondary);
    root.style.setProperty('--color-accent', this.colors.accent);
    root.style.setProperty('--color-background', this.colors.background);
    root.style.setProperty('--color-text', this.colors.text);
  }

  updateFonts() {
    const root = document.documentElement;
    // Actualizar fuentes
    root.style.setProperty('--font-title-family', this.fonts.title.family);
    root.style.setProperty('--font-subtitle-family', this.fonts.subtitle.family);
    root.style.setProperty('--font-body-family', this.fonts.body.family);

    // Actualizar tamaños
    root.style.setProperty('--font-title-size', `${this.fonts.title.size}px`);
    root.style.setProperty('--font-subtitle-size', `${this.fonts.subtitle.size}px`);
    root.style.setProperty('--font-body-size', `${this.fonts.body.size}px`);

    // Actualizar pesos
    root.style.setProperty('--font-title-weight', this.fonts.title.weight);
    root.style.setProperty('--font-subtitle-weight', this.fonts.subtitle.weight);
    root.style.setProperty('--font-body-weight', this.fonts.body.weight);
  }

  saveCurrentStyle() {
    if (!this.newStyleName.trim()) {
      alert('Por favor, ingresa un nombre para el estilo');
      return;
    }

    const newStyle: SavedStyle = {
      id: Date.now().toString(),
      name: this.newStyleName,
      colors: { ...this.colors },
      fonts: {
        title: { ...this.fonts.title },
        subtitle: { ...this.fonts.subtitle },
        body: { ...this.fonts.body }
      }
    };

    this.savedStyles.push(newStyle);
    this.newStyleName = '';

    // Guardar en localStorage
    localStorage.setItem('savedStyles', JSON.stringify(this.savedStyles));
  }

  applyStyle(style: SavedStyle) {
    this.colors = { ...style.colors };
    this.fonts = {
      title: { ...style.fonts.title },
      subtitle: { ...style.fonts.subtitle },
      body: { ...style.fonts.body }
    };
    this.updateColors();
    this.updateFonts();
  }

  deleteStyle(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este estilo?')) {
      this.savedStyles = this.savedStyles.filter(style => style.id !== id);
      localStorage.setItem('savedStyles', JSON.stringify(this.savedStyles));
    }
  }

  ngOnInit() {
    // Cargar estilos guardados del localStorage
    const savedStyles = localStorage.getItem('savedStyles');
    if (savedStyles) {
      this.savedStyles = JSON.parse(savedStyles);
    }
  }
}