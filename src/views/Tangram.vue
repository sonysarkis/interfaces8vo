<template>
  <div class="tangram-container">
    <!-- Header -->
    <div class="tangram-header">
      <h1 class="tangram-title">Tangram Interactivo</h1>
      <p class="tangram-description">
        Explora y manipula este tangram 3D interactivo. Arrastra las piezas para crear diferentes formas y patrones.
      </p>
    </div>

    <!-- Spline Viewer Container -->
    <div class="spline-container">
      <spline-viewer 
        url="https://prod.spline.design/6Wq2lMNE1b5cBZdl/scene.splinecode"
        @load="onSplineReady"
        @error="onSplineError"
      ></spline-viewer>
      
      <!-- Loading overlay -->
      <div v-if="!splineReady" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p class="loading-text">Cargando Tangram 3D...</p>
        <p class="debug-info">Si la carga es muy lenta, verifica tu conexión a internet</p>
      </div>
      
      <!-- Debug info -->
      <div v-if="splineReady && !showFallback" class="debug-corner">
        ✅ Spline cargado
      </div>
      
      <!-- Fallback content -->
      <div v-if="showFallback" class="fallback-content">
        <div class="fallback-icon">🧩</div>
        <h3>Vista Previa del Tangram</h3>
        <p>La experiencia 3D no pudo cargar completamente.</p>
        <p>Esto podría deberse a:</p>
        <ul>
          <li>Conexión a internet lenta</li>
          <li>Problemas con el servidor de Spline</li>
          <li>Restricciones del navegador</li>
        </ul>
        <button @click="window.location.reload()" class="reload-button">
          🔄 Recargar página
        </button>
      </div>
    </div>

    <!-- Controls Panel -->
    <div class="controls-panel">
      <h3 class="controls-title">Controles</h3>
      <div class="controls-grid">
        <div class="control-item">
          <span class="control-key">Click + Arrastrar</span>
          <span class="control-action">Mover piezas</span>
        </div>
        <div class="control-item">
          <span class="control-key">Scroll</span>
          <span class="control-action">Zoom</span>
        </div>
        <div class="control-item">
          <span class="control-key">Click derecho + Arrastrar</span>
          <span class="control-action">Rotar vista</span>
        </div>
        <div class="control-item">
          <span class="control-key">R</span>
          <span class="control-action">Resetear vista</span>
        </div>
      </div>
    </div>

    <!-- Info Panel -->
    <div class="info-panel">
      <h3 class="info-title">Sobre el Tangram</h3>
      <p class="info-text">
        El tangram es un rompecabezas chino que consiste en formar siluetas de figuras con las siete piezas dadas 
        sin solaparlas. Las 7 piezas, llamadas "tans", son las siguientes: 5 triángulos de diferentes tamaños, 
        1 cuadrado y 1 paralelogramo romboide.
      </p>
      
      <!-- Navigation buttons -->
      <div class="navigation-buttons">
        <button @click="goBack" class="nav-button back-button">
          ← Volver
        </button>
        <button @click="resetView" class="nav-button reset-button">
          🔄 Resetear
        </button>
        <button @click="toggleFullscreen" class="nav-button fullscreen-button">
          ⛶ Pantalla completa
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// Router para navegación
const router = useRouter()

// Estado reactivo
const isFullscreen = ref(false)
const splineReady = ref(false)
const showFallback = ref(false)

// URL de la escena de Spline - puedes cambiar esta URL por tu escena real
const splineUrl = ref('https://prod.spline.design/6Wq2lMNE1b5cBZdl/scene.splinecode')

// Funciones
function goBack() {
  router.go(-1) // Volver a la página anterior
}

function resetView() {
  // Intentar resetear la vista de Spline
  const splineViewer = document.querySelector('spline-viewer') as any
  if (splineViewer && splineViewer.resetView) {
    splineViewer.resetView()
  } else {
    // Si no hay método resetView, recargar el componente
    window.location.reload()
  }
}

function toggleFullscreen() {
  const container = document.querySelector('.spline-container') as HTMLElement
  
  if (!document.fullscreenElement) {
    container.requestFullscreen().then(() => {
      isFullscreen.value = true
    }).catch(err => {
      console.log('Error al entrar en pantalla completa:', err)
    })
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false
    })
  }
}

function onSplineReady() {
  splineReady.value = true
  console.log('Tangram 3D cargado correctamente')
}

function onSplineError(error: any) {
  splineReady.value = true // Ocultar loading incluso en error
  console.error('Error al cargar el Tangram 3D:', error)
}

// Lifecycle hooks
onMounted(() => {
  // Escuchar cambios de pantalla completa
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
  
  // Timeout de seguridad para ocultar el loading
  setTimeout(() => {
    if (!splineReady.value) {
      splineReady.value = true
      showFallback.value = true
      console.log('Timeout de carga alcanzado, mostrando fallback')
    }
  }, 8000) // 8 segundos
})

onUnmounted(() => {
  // Cleanup si es necesario
})
</script>

<style scoped>
.tangram-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  box-sizing: border-box;
}

.tangram-header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.tangram-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.tangram-description {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
  line-height: 1.6;
}

.spline-container {
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 500px;
  margin-bottom: 2rem;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
}

spline-viewer {
  width: 100%;
  height: 100%;
  border-radius: 15px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 15px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 500;
}

.debug-info {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.5rem;
  text-align: center;
}

.debug-corner {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 10;
}

.fallback-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  z-index: 5;
}

.fallback-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.fallback-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.fallback-content p {
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.fallback-content ul {
  text-align: left;
  margin: 1rem 0;
  opacity: 0.8;
}

.fallback-content li {
  margin-bottom: 0.5rem;
}

.reload-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.reload-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}


.controls-panel {
  background: rgba(255,255,255,0.95);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.controls-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.control-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.control-key {
  font-weight: 600;
  color: #667eea;
}

.control-action {
  color: #666;
}

.info-panel {
  background: rgba(255,255,255,0.95);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.info-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.info-text {
  line-height: 1.7;
  color: #555;
  margin-bottom: 1.5rem;
}

.navigation-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.back-button {
  background: #6c757d;
  color: white;
}

.back-button:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.reset-button {
  background: #17a2b8;
  color: white;
}

.reset-button:hover {
  background: #138496;
  transform: translateY(-2px);
}

.fullscreen-button {
  background: #28a745;
  color: white;
}

.fullscreen-button:hover {
  background: #218838;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .tangram-container {
    padding: 1rem;
  }

  .tangram-title {
    font-size: 2rem;
  }

  .tangram-description {
    font-size: 1rem;
  }

  .spline-container {
    height: 50vh;
    min-height: 300px;
  }

  .controls-grid {
    grid-template-columns: 1fr;
  }

  .navigation-buttons {
    flex-direction: column;
  }

  .nav-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .tangram-container {
    padding: 0.5rem;
  }

  .tangram-title {
    font-size: 1.5rem;
  }

  .controls-panel,
  .info-panel {
    padding: 1rem;
  }
}

/* Estilos para pantalla completa */
.spline-container:fullscreen {
  background: black;
  border-radius: 0;
}

.spline-container:fullscreen spline-viewer {
  border-radius: 0;
}
</style>
