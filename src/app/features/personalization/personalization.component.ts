import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

interface SavedStyle {
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
      size: string;
      weight: string;
    };
    subtitle: {
      family: string;
      size: string;
      weight: string;
    };
    body: {
      family: string;
      size: string;
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
              <div class="control-group">
                <label class="block text-sm font-medium text-text mb-1">Color 1</label>
                <div class="flex items-center gap-4">
                  <input 
                    type="color" 
                    [(ngModel)]="colors.primary" 
                    class="w-16 h-10 rounded border border-text">
                  <span class="text-sm text-text">{{colors.primary}}</span>
                </div>
              </div>

              <div class="control-group">
                <label class="block text-sm font-medium text-text mb-1">Color 2</label>
                <div class="flex items-center gap-4">
                  <input 
                    type="color" 
                    [(ngModel)]="colors.secondary" 
                    class="w-16 h-10 rounded border border-text">
                  <span class="text-sm text-text">{{colors.secondary}}</span>
                </div>
              </div>

              <div class="control-group">
                <label class="block text-sm font-medium text-text mb-1">Color 3</label>
                <div class="flex items-center gap-4">
                  <input 
                    type="color" 
                    [(ngModel)]="colors.accent" 
                    class="w-16 h-10 rounded border border-text">
                  <span class="text-sm text-text">{{colors.accent}}</span>
                </div>
              </div>

              <div class="control-group">
                <label class="block text-sm font-medium text-text mb-1">Color 4</label>
                <div class="flex items-center gap-4">
                  <input 
                    type="color" 
                    [(ngModel)]="colors.background" 
                    class="w-16 h-10 rounded border border-text">
                  <span class="text-sm text-text">{{colors.background}}</span>
                </div>
              </div>

              <div class="control-group">
                <label class="block text-sm font-medium text-text mb-1">Color 5</label>
                <div class="flex items-center gap-4">
                  <input 
                    type="color" 
                    [(ngModel)]="colors.text" 
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
            
            <!-- Subir Tipografía -->
            <div class="p-4 border-t border-text">
              <h3 class="text-lg font-medium text-primary mb-3">Subir Tipografía</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <input 
                    type="file" 
                    accept=".ttf"
                    (change)="onFontFileSelected($event)"
                    class="hidden"
                    #fontFileInput>
                  <button 
                    (click)="fontFileInput.click()"
                    class="bg-primary text-background px-4 py-2 rounded hover:bg-opacity-80">
                    Seleccionar Archivo TTF
                  </button>
                  <span *ngIf="selectedFontFile" class="text-sm text-text">
                    {{selectedFontFile.name}}
                  </span>
                </div>
                <div *ngIf="selectedFontFile" class="flex gap-2">
                  <button 
                    (click)="uploadFont()"
                    class="bg-secondary text-background px-4 py-2 rounded hover:bg-opacity-80">
                    Subir Tipografía
                  </button>
                  <button 
                    (click)="cancelFontUpload()"
                    class="bg-accent text-background px-4 py-2 rounded hover:bg-opacity-80">
                    Cancelar
                  </button>
                </div>
                <div *ngIf="uploadedFonts.length > 0" class="mt-4">
                  <h4 class="text-sm font-medium text-primary mb-2">Tipografías Subidas:</h4>
                  <div class="space-y-2">
                    <div *ngFor="let font of uploadedFonts" 
                         class="flex items-center justify-between p-2 bg-background rounded">
                      <span class="text-sm text-text">{{font.name}}</span>
                      <button 
                        (click)="deleteFont(font)"
                        class="text-accent hover:text-opacity-80">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Título -->
            <div class="p-4 border-t border-text">
              <h3 class="text-lg font-medium text-primary mb-2">Título</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Fuente</label>
                  <select 
                    [(ngModel)]="fonts.title.family" 
                    class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary">
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Courier New', monospace">Courier New</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Tamaño (px)</label>
                  <div class="flex items-center gap-4">
                    <input 
                      type="range" 
                      [(ngModel)]="fonts.title.size" 
                      min="24" 
                      max="48" 
                      step="1"
                      class="flex-1">
                    <span class="text-sm text-text w-16">{{fonts.title.size}}px</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Peso de la Fuente</label>
                  <select 
                    [(ngModel)]="fonts.title.weight" 
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
                  <select 
                    [(ngModel)]="fonts.subtitle.family" 
                    class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary">
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Courier New', monospace">Courier New</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Tamaño (px)</label>
                  <div class="flex items-center gap-4">
                    <input 
                      type="range" 
                      [(ngModel)]="fonts.subtitle.size" 
                      min="18" 
                      max="32" 
                      step="1"
                      class="flex-1">
                    <span class="text-sm text-text w-16">{{fonts.subtitle.size}}px</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Peso de la Fuente</label>
                  <select 
                    [(ngModel)]="fonts.subtitle.weight" 
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
                  <select 
                    [(ngModel)]="fonts.body.family" 
                    class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary">
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Courier New', monospace">Courier New</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Tamaño (px)</label>
                  <div class="flex items-center gap-4">
                    <input 
                      type="range" 
                      [(ngModel)]="fonts.body.size" 
                      min="12" 
                      max="20" 
                      step="1"
                      class="flex-1">
                    <span class="text-sm text-text w-16">{{fonts.body.size}}px</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Peso de la Fuente</label>
                  <select 
                    [(ngModel)]="fonts.body.weight" 
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
                  <button (click)="saveStyle()"
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
                      <button (click)="deleteStyle(style)"
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
        <div [style.background-color]="colors.background" class="rounded-lg p-4 overflow-y-auto">
          <div [ngStyle]="{
            '--color-primary': colors.primary,
            '--color-secondary': colors.secondary,
            '--color-accent': colors.accent,
            '--color-background': colors.background,
            '--color-text': colors.text,
            '--font-title-family': fonts.title.family,
            '--font-title-size': fonts.title.size + 'px',
            '--font-title-weight': fonts.title.weight,
            '--font-subtitle-family': fonts.subtitle.family,
            '--font-subtitle-size': fonts.subtitle.size + 'px',
            '--font-subtitle-weight': fonts.subtitle.weight,
            '--font-body-family': fonts.body.family,
            '--font-body-size': fonts.body.size + 'px',
            '--font-body-weight': fonts.body.weight
          }" class="preview-content">
            <!-- Tipografía -->
            <div class="mb-6">
              <h3 [style.color]="colors.primary" class="text-lg font-medium mb-3">Tipografía</h3>
              <div class="space-y-4">
                <div>
                  <h1 [style.font-family]="fonts.title.family"
                      [style.font-size.px]="fonts.title.size"
                      [style.font-weight]="fonts.title.weight"
                      [style.color]="colors.primary">
                    Título Principal
                  </h1>
                  <p [style.color]="colors.text" class="text-sm mt-1">
                    Fuente: {{fonts.title.family}} | Tamaño: {{fonts.title.size}}px | Peso: {{fonts.title.weight}}
                  </p>
                </div>
                <div>
                  <h2 [style.font-family]="fonts.subtitle.family"
                      [style.font-size.px]="fonts.subtitle.size"
                      [style.font-weight]="fonts.subtitle.weight"
                      [style.color]="colors.primary">
                    Subtítulo
                  </h2>
                  <p [style.color]="colors.text" class="text-sm mt-1">
                    Fuente: {{fonts.subtitle.family}} | Tamaño: {{fonts.subtitle.size}}px | Peso: {{fonts.subtitle.weight}}
                  </p>
                </div>
                <div>
                  <p [style.font-family]="fonts.body.family"
                     [style.font-size.px]="fonts.body.size"
                     [style.font-weight]="fonts.body.weight"
                     [style.color]="colors.text">
                    Este es un párrafo de texto normal. Aquí puedes ver cómo se ve el texto con la fuente, tamaño y peso seleccionados.
                  </p>
                  <p [style.color]="colors.text" class="text-sm mt-1">
                    Fuente: {{fonts.body.family}} | Tamaño: {{fonts.body.size}}px | Peso: {{fonts.body.weight}}
                  </p>
                </div>
              </div>
            </div>

            <!-- Componentes -->
            <div class="space-y-6">
              <!-- Navbar -->
              <div>
                <h3 [style.color]="colors.primary" class="text-lg font-medium mb-3">Navbar</h3>
                <nav [style.background-color]="colors.primary" class="p-4 rounded-lg">
                  <div class="flex justify-between items-center">
                    <div [style.font-family]="fonts.title.family"
                         [style.font-size.px]="fonts.title.size"
                         [style.font-weight]="fonts.title.weight"
                         [style.color]="colors.background">
                      Logo
                    </div>
                    <div class="flex space-x-4">
                      <a [style.color]="colors.background" 
                         [style.font-family]="fonts.body.family"
                         [style.font-size.px]="fonts.body.size"
                         [style.hover-color]="colors.accent"
                         class="hover:opacity-80">Inicio</a>
                      <a [style.color]="colors.background"
                         [style.font-family]="fonts.body.family"
                         [style.font-size.px]="fonts.body.size"
                         [style.hover-color]="colors.accent"
                         class="hover:opacity-80">Servicios</a>
                      <button [style.background-color]="colors.accent"
                              [style.color]="colors.background"
                              [style.font-family]="fonts.body.family"
                              [style.font-size.px]="fonts.body.size"
                              class="px-4 py-2 rounded hover:opacity-80">
                        Login
                      </button>
                    </div>
                  </div>
                </nav>
              </div>

              <!-- Botones -->
              <div>
                <h3 [style.color]="colors.primary" class="text-lg font-medium mb-3">Botones</h3>
                <div class="flex flex-wrap gap-4">
                  <button [style.background-color]="colors.primary"
                          [style.color]="colors.background"
                          [style.font-family]="fonts.body.family"
                          [style.font-size.px]="fonts.body.size"
                          class="px-4 py-2 rounded hover:opacity-80">
                    Botón Primario
                  </button>
                  <button [style.background-color]="colors.secondary"
                          [style.color]="colors.background"
                          [style.font-family]="fonts.body.family"
                          [style.font-size.px]="fonts.body.size"
                          class="px-4 py-2 rounded hover:opacity-80">
                    Botón Secundario
                  </button>
                  <button [style.background-color]="colors.accent"
                          [style.color]="colors.background"
                          [style.font-family]="fonts.body.family"
                          [style.font-size.px]="fonts.body.size"
                          class="px-4 py-2 rounded hover:opacity-80">
                    Botón de Acento
                  </button>
                </div>
              </div>

              <!-- Formulario -->
              <div>
                <h3 [style.color]="colors.primary" class="text-lg font-medium mb-3">Formulario</h3>
                <div [style.background-color]="colors.background" class="p-4 rounded-lg space-y-4">
                  <div>
                    <label [style.font-family]="fonts.body.family"
                           [style.font-size.px]="fonts.body.size"
                           [style.color]="colors.text"
                           class="block mb-1">Campo de Texto</label>
                    <input type="text" 
                           [style.font-family]="fonts.body.family"
                           [style.font-size.px]="fonts.body.size"
                           [style.color]="colors.text"
                           [style.background-color]="colors.background"
                           [style.border-color]="colors.text"
                           class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                           [style.focus-ring-color]="colors.secondary"
                           placeholder="Escribe algo...">
                  </div>
                  <div>
                    <label [style.font-family]="fonts.body.family"
                           [style.font-size.px]="fonts.body.size"
                           [style.color]="colors.text"
                           class="block mb-1">Área de Texto</label>
                    <textarea [style.font-family]="fonts.body.family"
                              [style.font-size.px]="fonts.body.size"
                              [style.color]="colors.text"
                              [style.background-color]="colors.background"
                              [style.border-color]="colors.text"
                              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                              [style.focus-ring-color]="colors.secondary"
                              rows="3"
                              placeholder="Escribe un mensaje..."></textarea>
                  </div>
                </div>
              </div>

              <!-- Tarjetas -->
              <div>
                <h3 [style.color]="colors.primary" class="text-lg font-medium mb-3">Tarjetas</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div [style.border-color]="colors.text" 
                       [style.background-color]="colors.background"
                       class="border rounded-lg p-4">
                    <h3 [style.font-family]="fonts.subtitle.family"
                        [style.font-size.px]="fonts.subtitle.size"
                        [style.font-weight]="fonts.subtitle.weight"
                        [style.color]="colors.primary"
                        class="mb-2">Tarjeta de Contenido</h3>
                    <p [style.font-family]="fonts.body.family"
                       [style.font-size.px]="fonts.body.size"
                       [style.color]="colors.text">
                      Este es un ejemplo de cómo se verá el contenido en una tarjeta con los colores seleccionados.
                    </p>
                  </div>
                  <div [style.background-color]="colors.primary" class="rounded-lg p-4">
                    <h3 [style.font-family]="fonts.subtitle.family"
                        [style.font-size.px]="fonts.subtitle.size"
                        [style.font-weight]="fonts.subtitle.weight"
                        [style.color]="colors.background"
                        class="mb-2">Tarjeta Invertida</h3>
                    <p [style.font-family]="fonts.body.family"
                       [style.font-size.px]="fonts.body.size"
                       [style.color]="colors.background">
                      Esta tarjeta usa el color primario como fondo y texto claro.
                    </p>
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
export class PersonalizationComponent implements OnInit {
  activeTab: 'colors' | 'typography' | 'saved' = 'colors';
  newStyleName: string = '';
  savedStyles: SavedStyle[] = [];
  previewStyles: string = '';
  selectedFontFile: File | null = null;
  uploadedFonts: { name: string; url: string }[] = [];

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
      size: '36px',
      weight: '700'
    },
    subtitle: {
      family: 'Inter',
      size: '24px',
      weight: '600'
    },
    body: {
      family: 'Inter',
      size: '16px',
      weight: '400'
    }
  };

  ngOnInit() {
    this.loadSavedStyles();
  }

  // Guarda los estilos en localStorage
  saveToLocalStorage(): void {
    localStorage.setItem('savedStyles', JSON.stringify(this.savedStyles));
  }

  // Carga los estilos desde localStorage
  async loadSavedStyles(): Promise<void> {
    try {
      const res = await fetch('/styles/index');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        this.savedStyles = data.map((style: any) => ({
          name: style.name,
          colors: {
            primary: style.primary,
            secondary: style.secondary,
            accent: style.accent,
            background: style.background,
            text: style.text
          },
          fonts: {
            title: {
              family: style.familyTitle,
              size: style.sizeTitle,
              weight: style.weightTitle
            },
            subtitle: {
              family: style.familySubtitle,
              size: style.sizeSubtitle,
              weight: style.weightSubtitle
            },
            body: {
              family: style.familyBody,
              size: style.sizeBody,
              weight: style.weightBody
            }
          }
        }));
      } else {
        this.savedStyles = [];
      }
    } catch (error) {
      this.savedStyles = [];
    }
  }

  // Aplica un estilo guardado
  applyStyle(style: SavedStyle): void {
    this.colors = { ...style.colors };
    this.fonts = {
      title: { ...style.fonts.title },
      subtitle: { ...style.fonts.subtitle },
      body: { ...style.fonts.body }
    };
  }

  async saveStyle() {
    if (!this.newStyleName) {
      await Swal.fire({
        icon: 'warning',
        title: 'Nombre requerido',
        text: 'Por favor, ingresa un nombre para el estilo.',
        confirmButtonColor: '#6366f1'
      });
      return;
    }
  
    // Construir el objeto de estilo según espera el backend
    const style = {
      name: this.newStyleName,
      primary: this.colors.primary,
      secondary: this.colors.secondary,
      accent: this.colors.accent,
      background: this.colors.background,
      text: this.colors.text,
      familyTitle: this.fonts.title.family,
      sizeTitle: this.fonts.title.size,
      weightTitle: this.fonts.title.weight,
      familySubtitle: this.fonts.subtitle.family,
      sizeSubtitle: this.fonts.subtitle.size,
      weightSubtitle: this.fonts.subtitle.weight,
      familyBody: this.fonts.body.family,
      sizeBody: this.fonts.body.size,
      weightBody: this.fonts.body.weight
    };
  
    try {
      const res = await fetch('/styles/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(style)
      });
      const data = await res.json();
      if (!res.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error?.error || data.error || 'No se pudo guardar el estilo.',
          confirmButtonColor: '#e11d48'
        });
        return;
      }
      await Swal.fire({
        icon: 'success',
        title: 'Estilo guardado',
        text: 'El estilo se guardó correctamente en la base de datos.',
        confirmButtonColor: '#6366f1'
      });
      this.newStyleName = '';
      // Opcional: recargar la lista de estilos desde la base de datos
      await this.loadSavedStyles();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#e11d48'
      });
    }
  }

  async deleteStyle(style: SavedStyle) {
    const result = await Swal.fire({
      title: '¿Eliminar estilo?',
      text: '¿Estás seguro de que deseas eliminar este estilo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#6366f1'
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch('/styles/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: style.name })
        });
        const data = await res.json();
        if (!res.ok) {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error?.error || data.error || 'No se pudo eliminar el estilo.',
            confirmButtonColor: '#e11d48'
          });
          return;
        }
        // Elimina del frontend
        this.savedStyles = this.savedStyles.filter(s => s.name !== style.name);
        await Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El estilo ha sido eliminado.',
          confirmButtonColor: '#6366f1'
        });
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Error de red',
          text: 'No se pudo conectar con el servidor.',
          confirmButtonColor: '#e11d48'
        });
      }
    }
  }

  onFontFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'font/ttf' || file.name.endsWith('.ttf')) {
        this.selectedFontFile = file;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Archivo inválido',
          text: 'Por favor, selecciona un archivo TTF válido.',
          confirmButtonColor: '#e11d48'
        });
        input.value = '';
      }
    }
  }

  uploadFont() {
    if (!this.selectedFontFile) return;

    // Crear un nombre único para la fuente
    const fontName = this.selectedFontFile.name.replace('.ttf', '');

    // Crear una URL para la fuente
    const fontUrl = URL.createObjectURL(this.selectedFontFile);

    // Agregar la fuente a la lista de fuentes subidas
    this.uploadedFonts.push({
      name: fontName,
      url: fontUrl
    });

    // Agregar la fuente a las opciones de selección
    this.addFontToSelectOptions(fontName);

    // Limpiar la selección
    this.selectedFontFile = null;
  }

  cancelFontUpload() {
    this.selectedFontFile = null;
  }

  deleteFont(font: { name: string; url: string }) {
    // Revocar la URL del objeto
    URL.revokeObjectURL(font.url);

    // Eliminar la fuente de la lista
    this.uploadedFonts = this.uploadedFonts.filter(f => f.name !== font.name);

    // Eliminar la fuente de las opciones de selección
    this.removeFontFromSelectOptions(font.name);
  }

  private addFontToSelectOptions(fontName: string) {
    // Agregar la fuente a las opciones de selección de título
    const titleSelect = document.querySelector('select[ng-model="fonts.title.family"]') as HTMLSelectElement;
    if (titleSelect) {
      const option = document.createElement('option');
      option.value = fontName;
      option.textContent = fontName;
      titleSelect.appendChild(option);
    }

    // Agregar la fuente a las opciones de selección de subtítulo
    const subtitleSelect = document.querySelector('select[ng-model="fonts.subtitle.family"]') as HTMLSelectElement;
    if (subtitleSelect) {
      const option = document.createElement('option');
      option.value = fontName;
      option.textContent = fontName;
      subtitleSelect.appendChild(option);
    }

    // Agregar la fuente a las opciones de selección de texto
    const bodySelect = document.querySelector('select[ng-model="fonts.body.family"]') as HTMLSelectElement;
    if (bodySelect) {
      const option = document.createElement('option');
      option.value = fontName;
      option.textContent = fontName;
      bodySelect.appendChild(option);
    }
  }

  private removeFontFromSelectOptions(fontName: string) {
    // Eliminar la fuente de las opciones de selección de título
    const titleSelect = document.querySelector('select[ng-model="fonts.title.family"]') as HTMLSelectElement;
    if (titleSelect) {
      const option = titleSelect.querySelector(`option[value="${fontName}"]`);
      if (option) option.remove();
    }

    // Eliminar la fuente de las opciones de selección de subtítulo
    const subtitleSelect = document.querySelector('select[ng-model="fonts.subtitle.family"]') as HTMLSelectElement;
    if (subtitleSelect) {
      const option = subtitleSelect.querySelector(`option[value="${fontName}"]`);
      if (option) option.remove();
    }

    // Eliminar la fuente de las opciones de selección de texto
    const bodySelect = document.querySelector('select[ng-model="fonts.body.family"]') as HTMLSelectElement;
    if (bodySelect) {
      const option = bodySelect.querySelector(`option[value="${fontName}"]`);
      if (option) option.remove();
    }
  }
}