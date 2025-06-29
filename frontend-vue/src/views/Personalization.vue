<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'

// Interfaces para TypeScript
interface ColorStyles {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

interface FontStyle {
  family: string
  size: string
  weight?: string
}

interface FontStyles {
  title: FontStyle
  subtitle: FontStyle
  body: FontStyle
}

interface Styles {
  colors: ColorStyles
  fonts: FontStyles
  name?: string
}

interface Preset {
  id: string
  name: string
  styles: Styles
  createdAt: string
}

// Estado reactivo
const currentStyles = reactive<Styles>({
  colors: {
    primary: '#2C3E50',
    secondary: '#3498DB',
    accent: '#E74C3C',
    background: '#ECF0F1',
    text: '#95A5A6'
  },
  fonts: {
    title: {
      family: 'Arial, sans-serif',
      size: '3rem',
      weight: 'bold'
    },
    subtitle: {
      family: 'Arial, sans-serif',
      size: '1.5rem',
      weight: '600'
    },
    body: {
      family: 'Arial, sans-serif',
      size: '1rem',
      weight: 'normal'
    }
  }
})

const titleFontSize = ref(48)
const subtitleFontSize = ref(24)
const bodyFontSize = ref(16)
const savedPresets = ref<Preset[]>([])
const activeSection = ref<'colors' | 'fonts' | 'saved'>('colors')
const hasUnsavedChanges = ref(false)

// Computed properties para los colores de texto
const titleColor = computed(() => currentStyles.colors.background)
const subtitleColor = computed(() => currentStyles.colors.primary)
const bodyColor = computed(() => currentStyles.colors.text)

// Métodos
const updateStyles = () => {
  hasUnsavedChanges.value = true
  // Aplicar estilos globalmente
  applyStylesToDocument()
}

const applyStylesToDocument = () => {
  const root = document.documentElement
  root.style.setProperty('--color-primary', currentStyles.colors.primary)
  root.style.setProperty('--color-secondary', currentStyles.colors.secondary)
  root.style.setProperty('--color-accent', currentStyles.colors.accent)
  root.style.setProperty('--color-background', currentStyles.colors.background)
  root.style.setProperty('--color-text', currentStyles.colors.text)
  root.style.setProperty('--font-title-family', currentStyles.fonts.title.family)
  root.style.setProperty('--font-title-size', currentStyles.fonts.title.size)
  root.style.setProperty('--font-title-weight', currentStyles.fonts.title.weight || 'bold')
  root.style.setProperty('--font-subtitle-family', currentStyles.fonts.subtitle.family)
  root.style.setProperty('--font-subtitle-size', currentStyles.fonts.subtitle.size)
  root.style.setProperty('--font-subtitle-weight', currentStyles.fonts.subtitle.weight || '600')
  root.style.setProperty('--font-body-family', currentStyles.fonts.body.family)
  root.style.setProperty('--font-body-size', currentStyles.fonts.body.size)
  root.style.setProperty('--font-body-weight', currentStyles.fonts.body.weight || 'normal')
}

const updateFontStyles = (type: 'title' | 'subtitle' | 'body') => {
  switch (type) {
    case 'title':
      currentStyles.fonts.title.size = `${titleFontSize.value}px`
      break
    case 'subtitle':
      currentStyles.fonts.subtitle.size = `${subtitleFontSize.value}px`
      break
    case 'body':
      currentStyles.fonts.body.size = `${bodyFontSize.value}px`
      break
  }
  updateStyles()
}

const uploadFont = (event: Event, type: 'title' | 'subtitle' | 'body') => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    console.log(`Subiendo fuente para ${type}:`, file.name)
    
    const fontName = file.name.replace(/\.[^/.]+$/, '')
    switch (type) {
      case 'title':
        currentStyles.fonts.title.family = `${fontName}, sans-serif`
        break
      case 'subtitle':
        currentStyles.fonts.subtitle.family = `${fontName}, sans-serif`
        break
      case 'body':
        currentStyles.fonts.body.family = `${fontName}, sans-serif`
        break
    }
    updateStyles()
  }
}

const saveCurrentStyles = () => {
  const presetName = prompt('Nombre del preset:')
  if (presetName) {
    const newPreset: Preset = {
      id: Date.now().toString(),
      name: presetName,
      styles: JSON.parse(JSON.stringify(currentStyles)),
      createdAt: new Date().toISOString()
    }
    savedPresets.value.unshift(newPreset)
    
    localStorage.setItem('savedPresets', JSON.stringify(savedPresets.value))
    hasUnsavedChanges.value = false
    
    // Mostrar notificación de éxito
    showNotification('Preset guardado correctamente', 'success')
  }
}

const loadPreset = (presetId: string) => {
  const preset = savedPresets.value.find(p => p.id === presetId)
  if (preset) {
    Object.assign(currentStyles, preset.styles)
    
    // Actualizar los valores de los sliders
    titleFontSize.value = parseInt(preset.styles.fonts.title.size)
    subtitleFontSize.value = parseInt(preset.styles.fonts.subtitle.size)
    bodyFontSize.value = parseInt(preset.styles.fonts.body.size)
    
    updateStyles()
    showNotification('Preset cargado correctamente', 'success')
  }
}

const deletePreset = (presetId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este preset?')) {
    savedPresets.value = savedPresets.value.filter(p => p.id !== presetId)
    localStorage.setItem('savedPresets', JSON.stringify(savedPresets.value))
    showNotification('Preset eliminado correctamente', 'success')
  }
}

const resetToDefault = () => {
  if (confirm('¿Estás seguro de que quieres restablecer los estilos por defecto?')) {
    Object.assign(currentStyles, {
      colors: {
        primary: '#2C3E50',
        secondary: '#3498DB',
        accent: '#E74C3C',
        background: '#ECF0F1',
        text: '#95A5A6'
      },
      fonts: {
        title: {
          family: 'Arial, sans-serif',
          size: '48px',
          weight: 'bold'
        },
        subtitle: {
          family: 'Arial, sans-serif',
          size: '24px',
          weight: '600'
        },
        body: {
          family: 'Arial, sans-serif',
          size: '16px',
          weight: 'normal'
        }
      }
    })
    
    titleFontSize.value = 48
    subtitleFontSize.value = 24
    bodyFontSize.value = 16
    
    updateStyles()
    showNotification('Estilos restablecidos por defecto', 'success')
  }
}

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  // Crear notificación simple
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}

// Cargar presets guardados al montar el componente
onMounted(() => {
  const saved = localStorage.getItem('savedPresets')
  if (saved) {
    try {
      savedPresets.value = JSON.parse(saved)
    } catch (error) {
      console.error('Error al cargar presets guardados:', error)
    }
  }
  
  // Aplicar estilos iniciales
  applyStylesToDocument()
})

// Watch para cambios en los estilos
watch(currentStyles, () => {
  hasUnsavedChanges.value = true
}, { deep: true })
</script>

<template>
  <div class="personalization-container">
    <!-- Panel izquierdo - Controles -->
    <div class="controls-panel">
      <div class="controls-header">
        <h1 class="text-2xl font-bold mb-4">Personalización</h1>
        
        <!-- Tabs de navegación -->
        <div class="tabs">
          <button 
            @click="activeSection = 'colors'"
            :class="['tab', activeSection === 'colors' ? 'tab-active' : 'tab-inactive']">
            Colores
          </button>
          <button 
            @click="activeSection = 'fonts'"
            :class="['tab', activeSection === 'fonts' ? 'tab-active' : 'tab-inactive']">
            Fuentes
          </button>
          <button 
            @click="activeSection = 'saved'"
            :class="['tab', activeSection === 'saved' ? 'tab-active' : 'tab-inactive']">
            Estilos Guardados
          </button>
        </div>
      </div>

      <!-- Sección de Colores -->
      <div v-if="activeSection === 'colors'" class="section-content">
        <h2 class="section-title">Colores</h2>
        <div class="space-y-4">
          <div class="color-control">
            <label class="control-label">Color Primario</label>
            <div class="color-input-group">
              <input 
                type="color" 
                v-model="currentStyles.colors.primary" 
                @change="updateStyles()"
                class="color-picker">
              <span class="color-value">{{ currentStyles.colors.primary }}</span>
            </div>
          </div>
          
          <div class="color-control">
            <label class="control-label">Color Secundario</label>
            <div class="color-input-group">
              <input 
                type="color" 
                v-model="currentStyles.colors.secondary" 
                @change="updateStyles()"
                class="color-picker">
              <span class="color-value">{{ currentStyles.colors.secondary }}</span>
            </div>
          </div>
          
          <div class="color-control">
            <label class="control-label">Color de Acento</label>
            <div class="color-input-group">
              <input 
                type="color" 
                v-model="currentStyles.colors.accent" 
                @change="updateStyles()"
                class="color-picker">
              <span class="color-value">{{ currentStyles.colors.accent }}</span>
            </div>
          </div>
          
          <div class="color-control">
            <label class="control-label">Color de Fondo</label>
            <div class="color-input-group">
              <input 
                type="color" 
                v-model="currentStyles.colors.background" 
                @change="updateStyles()"
                class="color-picker">
              <span class="color-value">{{ currentStyles.colors.background }}</span>
            </div>
          </div>
          
          <div class="color-control">
            <label class="control-label">Color de Texto</label>
            <div class="color-input-group">
              <input 
                type="color" 
                v-model="currentStyles.colors.text" 
                @change="updateStyles()"
                class="color-picker">
              <span class="color-value">{{ currentStyles.colors.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de Fuentes -->
      <div v-if="activeSection === 'fonts'" class="section-content">
        <h2 class="section-title">Fuentes</h2>
        
        <!-- Título -->
        <div class="font-section">
          <h3 class="font-section-title">Título</h3>
          <div class="space-y-3">
            <div class="control-group">
              <label class="control-label">Tamaño</label>
              <div class="range-group">
                <input 
                  type="range" 
                  min="24" 
                  max="72" 
                  v-model="titleFontSize"
                  @input="updateFontStyles('title')" 
                  class="range-slider">
                <span class="range-value">{{ titleFontSize }}px</span>
              </div>
            </div>
            
            <div class="control-group">
              <label class="control-label">Fuente</label>
              <input 
                type="file" 
                @change="uploadFont($event, 'title')" 
                accept=".woff2,.woff,.ttf" 
                class="file-input">
            </div>
          </div>
        </div>

        <!-- Subtítulo -->
        <div class="font-section">
          <h3 class="font-section-title">Subtítulo</h3>
          <div class="space-y-3">
            <div class="control-group">
              <label class="control-label">Tamaño</label>
              <div class="range-group">
                <input 
                  type="range" 
                  min="16" 
                  max="48" 
                  v-model="subtitleFontSize"
                  @input="updateFontStyles('subtitle')" 
                  class="range-slider">
                <span class="range-value">{{ subtitleFontSize }}px</span>
              </div>
            </div>
            
            <div class="control-group">
              <label class="control-label">Fuente</label>
              <input 
                type="file" 
                @change="uploadFont($event, 'subtitle')" 
                accept=".woff2,.woff,.ttf"
                class="file-input">
            </div>
          </div>
        </div>

        <!-- Cuerpo de texto -->
        <div class="font-section">
          <h3 class="font-section-title">Cuerpo de Texto</h3>
          <div class="space-y-3">
            <div class="control-group">
              <label class="control-label">Tamaño</label>
              <div class="range-group">
                <input 
                  type="range" 
                  min="12" 
                  max="24" 
                  v-model="bodyFontSize"
                  @input="updateFontStyles('body')" 
                  class="range-slider">
                <span class="range-value">{{ bodyFontSize }}px</span>
              </div>
            </div>
            
            <div class="control-group">
              <label class="control-label">Fuente</label>
              <input 
                type="file" 
                @change="uploadFont($event, 'body')" 
                accept=".woff2,.woff,.ttf"
                class="file-input">
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de Estilos Guardados -->
      <div v-if="activeSection === 'saved'" class="section-content">
        <h2 class="section-title">Estilos Guardados</h2>
        <div class="saved-presets">
          <div 
            v-for="preset in savedPresets" 
            :key="preset.id" 
            class="preset-card">
            <div class="preset-info">
              <h3 class="preset-name">{{ preset.name }}</h3>
              <p class="preset-date">{{ new Date(preset.createdAt).toLocaleDateString() }}</p>
            </div>
            <div class="preset-actions">
              <button 
                @click="loadPreset(preset.id)"
                class="btn btn-primary btn-sm">
                Aplicar
              </button>
              <button 
                @click="deletePreset(preset.id)"
                class="btn btn-danger btn-sm">
                Eliminar
              </button>
            </div>
          </div>
          
          <div v-if="savedPresets.length === 0" class="empty-state">
            <p>No hay estilos guardados</p>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="action-buttons">
        <button 
          v-if="hasUnsavedChanges"
          @click="saveCurrentStyles()" 
          class="btn btn-primary">
          Guardar Cambios
        </button>
        <button 
          @click="resetToDefault()" 
          class="btn btn-secondary">
          Restablecer
        </button>
      </div>
    </div>

    <!-- Panel derecho - Vista previa -->
    <div class="preview-panel">
      <div class="preview-header">
        <h2>Vista Previa</h2>
        <p>Vista previa en tiempo real de los cambios</p>
      </div>
      
      <div class="preview-content" :style="{ backgroundColor: currentStyles.colors.background }">
        <!-- Mini Landing Page Preview -->
        <div class="mini-landing">
          <!-- Hero Section -->
          <section class="mini-hero" :style="{ 
            background: `linear-gradient(135deg, ${currentStyles.colors.primary} 0%, ${currentStyles.colors.secondary} 100%)` 
          }">
            <div class="mini-hero-content">
              <h1 :style="{
                fontFamily: currentStyles.fonts.title.family,
                fontSize: currentStyles.fonts.title.size,
                color: titleColor,
                fontWeight: currentStyles.fonts.title.weight
              }">
                Bienvenido a Nuestra Plataforma
              </h1>
              <p :style="{
                fontFamily: currentStyles.fonts.body.family,
                fontSize: currentStyles.fonts.body.size,
                color: bodyColor,
                fontWeight: currentStyles.fonts.body.weight
              }">
                Descubre soluciones innovadoras para tu negocio
              </p>
              <button class="mini-cta-button" :style="{
                backgroundColor: currentStyles.colors.accent,
                color: currentStyles.colors.background,
                fontFamily: currentStyles.fonts.body.family,
                fontSize: currentStyles.fonts.body.size,
                fontWeight: currentStyles.fonts.body.weight
              }">
                Comenzar Ahora
              </button>
            </div>
          </section>

          <!-- Services Section -->
          <section class="mini-services" :style="{ backgroundColor: currentStyles.colors.background }">
            <h2 :style="{
              fontFamily: currentStyles.fonts.subtitle.family,
              fontSize: currentStyles.fonts.subtitle.size,
              color: subtitleColor,
              fontWeight: currentStyles.fonts.subtitle.weight
            }">
              Nuestros Servicios
            </h2>
            <div class="mini-services-grid">
              <div class="mini-service-card" :style="{ backgroundColor: currentStyles.colors.primary }">
                <h3 :style="{
                  fontFamily: currentStyles.fonts.subtitle.family,
                  fontSize: currentStyles.fonts.subtitle.size,
                  color: titleColor
                }">Servicio 1</h3>
                <p :style="{
                  fontFamily: currentStyles.fonts.body.family,
                  fontSize: currentStyles.fonts.body.size,
                  color: bodyColor
                }">Descripción del servicio</p>
              </div>
              <div class="mini-service-card" :style="{ backgroundColor: currentStyles.colors.secondary }">
                <h3 :style="{
                  fontFamily: currentStyles.fonts.subtitle.family,
                  fontSize: currentStyles.fonts.subtitle.size,
                  color: titleColor
                }">Servicio 2</h3>
                <p :style="{
                  fontFamily: currentStyles.fonts.body.family,
                  fontSize: currentStyles.fonts.body.size,
                  color: bodyColor
                }">Descripción del servicio</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.personalization-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

.controls-panel {
  width: 400px;
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  padding: 1.5rem;
}

.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.controls-header {
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.tab {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.tab-active {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}

.tab-inactive {
  color: #6b7280;
}

.tab-inactive:hover {
  color: #374151;
}

.section-content {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #111827;
}

.color-control {
  margin-bottom: 1rem;
}

.control-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.color-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-picker {
  width: 50px;
  height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
}

.color-value {
  font-family: monospace;
  font-size: 0.875rem;
  color: #6b7280;
}

.font-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.font-section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
}

.control-group {
  margin-bottom: 1rem;
}

.range-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #d1d5db;
  outline: none;
  cursor: pointer;
}

.range-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.range-value {
  font-size: 0.875rem;
  color: #6b7280;
  min-width: 50px;
}

.file-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.saved-presets {
  space-y: 1rem;
}

.preset-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  background: #f9fafb;
}

.preset-info {
  flex: 1;
}

.preset-name {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.preset-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.preset-actions {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.preview-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.preview-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}

.preview-header p {
  color: #6b7280;
  font-size: 0.875rem;
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}

.mini-landing {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.mini-hero {
  padding: 2rem;
  text-align: center;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-hero-content {
  max-width: 600px;
}

.mini-hero h1 {
  margin-bottom: 1rem;
  line-height: 1.2;
}

.mini-hero p {
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.mini-cta-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mini-services {
  padding: 2rem;
  background: white;
}

.mini-services h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.mini-services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.mini-service-card {
  padding: 1rem;
  border-radius: 0.375rem;
  text-align: center;
}

.mini-service-card h3 {
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.mini-service-card p {
  font-size: 0.875rem;
  line-height: 1.4;
}

@media (max-width: 1024px) {
  .personalization-container {
    flex-direction: column;
  }
  
  .controls-panel {
    width: 100%;
    height: 50vh;
  }
  
  .preview-panel {
    height: 50vh;
  }
}
</style> 