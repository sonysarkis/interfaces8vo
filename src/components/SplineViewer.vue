<template>
  <div class="spline-viewer-wrapper">
    <spline-viewer 
      :url="splineUrl"
      @load="handleLoad"
      @error="handleError"
    ></spline-viewer>
    
    <!-- Loading state -->
    <div v-if="isLoading && showLoading" class="spline-loading">
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>
    
    <!-- Error state -->
    <div v-if="hasError" class="spline-error">
      <div class="error-icon">⚠️</div>
      <h3>Error al cargar el contenido 3D</h3>
      <p>{{ errorMessage }}</p>
      <button @click="retry" class="retry-button">Intentar de nuevo</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

// Props
interface Props {
  splineUrl: string
  showLoading?: boolean
  loadingText?: string
  autoRetry?: boolean
  retryDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  showLoading: true,
  loadingText: 'Cargando experiencia 3D...',
  autoRetry: true,
  retryDelay: 3000
})

// Emits
const emit = defineEmits<{
  load: []
  error: [error: any]
  ready: []
}>()

// Reactive state
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')
const retryCount = ref(0)
const maxRetries = 3

// Methods
function handleLoad() {
  isLoading.value = false
  hasError.value = false
  emit('load')
  emit('ready')
}

function handleError(error: any) {
  isLoading.value = false
  hasError.value = true
  errorMessage.value = error?.message || 'No se pudo cargar el contenido 3D'
  emit('error', error)
  
  // Auto retry logic
  if (props.autoRetry && retryCount.value < maxRetries) {
    setTimeout(() => {
      retry()
    }, props.retryDelay)
  }
}

function retry() {
  isLoading.value = true
  hasError.value = false
  retryCount.value++
  
  // Force reload by updating the URL slightly
  const viewer = document.querySelector('spline-viewer') as any
  if (viewer) {
    viewer.setAttribute('url', props.splineUrl + '?retry=' + Date.now())
  }
}

// Lifecycle
onMounted(() => {
  // Set a timeout to hide loading if it takes too long
  setTimeout(() => {
    if (isLoading.value) {
      isLoading.value = false
    }
  }, 10000) // 10 seconds timeout
})

// Watch for URL changes
watch(() => props.splineUrl, () => {
  isLoading.value = true
  hasError.value = false
  retryCount.value = 0
})
</script>

<style scoped>
.spline-viewer-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

spline-viewer {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: inherit;
}

.spline-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: inherit;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1rem;
  text-align: center;
  margin: 0;
}

.spline-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(244, 67, 54, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: inherit;
  z-index: 10;
  padding: 2rem;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.spline-error h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.spline-error p {
  margin: 0 0 1.5rem 0;
  opacity: 0.9;
}

.retry-button {
  background: white;
  color: #f44336;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #f5f5f5;
  transform: translateY(-1px);
}
</style>
