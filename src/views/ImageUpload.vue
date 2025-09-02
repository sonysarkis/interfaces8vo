<template>
  <div class="page-container">
    <div class="page-content">
      <!-- Header Section -->
      <div class="page-header">
        <h1 class="page-title">
          🖼️ Sube tus Imágenes
        </h1>
        <p class="page-subtitle">
          Crea un carrusel personalizado con imágenes recortadas y optimizadas
        </p>
      </div>

      <!-- Upload Section -->
      <div class="upload-section">
        <div class="upload-header">
          <h2 class="upload-title">Área de Carga</h2>
          <p class="upload-description">Arrastra y suelta imágenes o haz clic para seleccionar</p>
        </div>

        <!-- Drag & Drop Area -->
        <div 
          class="upload-zone"
          :class="{ 'upload-zone--active': isDragOver, 'upload-zone--has-files': pendingFiles.length > 0 }"
          @click="openFileDialog"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
        >
          <div class="upload-content">
            <div class="upload-icon">
              <svg v-if="pendingFiles.length === 0" class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <svg v-else class="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            
            <div v-if="pendingFiles.length === 0" class="upload-text">
              <p class="upload-text-primary">Selecciona archivos de imagen</p>
              <p class="upload-text-secondary">JPG, PNG, GIF, o cualquier formato de imagen</p>
            </div>
            
            <div v-else class="upload-text">
              <p class="upload-text-success">{{ pendingFiles.length }} imagen{{ pendingFiles.length !== 1 ? 'es' : '' }} lista{{ pendingFiles.length !== 1 ? 's' : '' }} para recortar</p>
              <p class="upload-text-secondary">Haz clic en "Recortar Imagen" para continuar</p>
            </div>

            <button 
              v-if="pendingFiles.length === 0"
              class="upload-button"
              @click.stop="openFileDialog"
            >
              Seleccionar Imágenes
            </button>
            
            <button 
              v-else
              class="upload-button upload-button--success"
              @click.stop="startCropping"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Recortar Imagen
            </button>
          </div>

          <input 
            ref="fileInput"
            type="file" 
            multiple 
            accept="image/*" 
            @change="onFileChange" 
            class="hidden"
          />
        </div>
      </div>

      <!-- Cropper Modal -->
      <div v-if="showCropper" class="cropper-modal">
        <div class="cropper-overlay" @click="cancelCrop"></div>
        <div class="cropper-container">
          <div class="cropper-header">
            <h2 class="cropper-title">✂️ Recorta tu imagen</h2>
            <p class="cropper-subtitle">Ajusta el recorte antes de añadirla al carrusel</p>
          </div>
          
          <div class="cropper-content">
            <cropper
              :src="cropperImage"
              :stencil-props="{ aspectRatio: 1 }"
              ref="cropperRef"
              class="cropper-component"
            />
          </div>
          
          <div class="cropper-actions">
            <button @click="confirmCrop" class="btn btn-primary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Agregar al Carrusel
            </button>
            <button @click="cancelCrop" class="btn btn-secondary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Images Carousel -->
      <div v-if="images.length" class="carousel-section">
        <div class="carousel-header">
          <h2 class="carousel-title">🖼️ Galería de Imágenes</h2>
          <div class="carousel-info">
            <span class="carousel-count">{{ images.length }} imagen{{ images.length !== 1 ? 'es' : '' }}</span>
            <button 
              @click="clearAllImages" 
              class="btn btn-danger btn-sm"
              v-if="images.length > 1"
            >
              Limpiar Todo
            </button>
          </div>
        </div>

        <div class="carousel-container">
          <div class="carousel" :style="carouselStyle">
            <div 
              v-for="(src, index) in images" 
              :key="index" 
              class="carousel-item"
            >
              <img :src="src" :alt="`Imagen ${index + 1}`" class="carousel-image">
              <button 
                @click="deleteImage(index)" 
                class="carousel-delete-btn"
                title="Eliminar imagen"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <button 
            v-if="currentIndex > 0"
            @click="prev" 
            class="carousel-nav-btn carousel-nav-btn--prev"
            title="Imagen anterior"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button 
            v-if="currentIndex < images.length - 1"
            @click="next" 
            class="carousel-nav-btn carousel-nav-btn--next"
            title="Siguiente imagen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <!-- Carousel Indicators -->
        <div class="carousel-indicators">
          <div 
            v-for="(_, index) in images" 
            :key="index"
            class="carousel-indicator"
            :class="{ 'carousel-indicator--active': index === currentIndex }"
            @click="goToImage(index)"
          ></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-container">
        <div class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h3 class="empty-title">No hay imágenes aún</h3>
          <p class="empty-description">Sube tu primera imagen para comenzar a crear tu galería</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useCarouselStore } from '@/store/carousel'
import Swal from 'sweetalert2'

// Store
const carouselStore = useCarouselStore()

// Refs
const fileInput = ref<HTMLInputElement | null>(null)
const currentIndex = ref(0)
const isDragOver = ref(false)

// Cropper state
const showCropper = ref(false)
const cropperImage = ref<string | null>(null)
const cropperRef = ref<any>(null)
const pendingFiles = ref<File[]>([])

// Computed
const images = computed(() => carouselStore.userImages)

// Methods
function openFileDialog() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  handleFiles(target.files)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = true
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  handleFiles(e.dataTransfer?.files || null)
}

function handleFiles(files: FileList | null) {
  if (!files) return
  
  const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
  
  if (imageFiles.length > 0) {
    pendingFiles.value = imageFiles
    showSuccess('Imágenes cargadas', `${imageFiles.length} imagen${imageFiles.length !== 1 ? 'es' : ''} lista${imageFiles.length !== 1 ? 's' : ''} para procesar`)
  } else {
    showError('Archivos inválidos', 'Por favor selecciona solo archivos de imagen')
  }
}

function startCropping() {
  if (pendingFiles.value.length > 0) {
    const reader = new FileReader()
    reader.onload = (e) => {
      cropperImage.value = e.target?.result as string
      showCropper.value = true
    }
    reader.readAsDataURL(pendingFiles.value[0])
  }
}

function confirmCrop() {
  if (cropperRef.value) {
    const result = cropperRef.value.getResult()
    if (result && result.canvas) {
      carouselStore.addImage(result.canvas.toDataURL('image/png'))
      showSuccess('¡Imagen agregada!', 'La imagen se añadió correctamente al carrusel.')
    }
  }
  
  // Process next pending file
  pendingFiles.value.shift()
  if (pendingFiles.value.length > 0) {
    const reader = new FileReader()
    reader.onload = (e) => {
      cropperImage.value = e.target?.result as string
    }
    reader.readAsDataURL(pendingFiles.value[0])
  } else {
    showCropper.value = false
    cropperImage.value = null
    showSuccess('Proceso completado', 'Todas las imágenes han sido procesadas')
  }
}

function cancelCrop() {
  showCropper.value = false
  cropperImage.value = null
  pendingFiles.value = []
  showInfo('Cancelado', 'El recorte de la imagen fue cancelado.')
}

function deleteImage(index: number) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la imagen del carrusel.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      carouselStore.removeImage(index)
      if (currentIndex.value > images.value.length - 1) {
        currentIndex.value = Math.max(0, images.value.length - 1)
      }
      showSuccess('Eliminada', 'La imagen ha sido eliminada correctamente.')
    }
  })
}

async function clearAllImages() {
  const result = await Swal.fire({
    title: '¿Eliminar todas las imágenes?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar todo',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    carouselStore.clearImages()
    currentIndex.value = 0
    showSuccess('Galería limpiada', 'Todas las imágenes han sido eliminadas.')
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function next() {
  if (currentIndex.value < images.value.length - 1) {
    currentIndex.value++
  }
}

function goToImage(index: number) {
  currentIndex.value = index
}

const carouselStyle = computed(() => {
  const itemWidth = 265 // Ancho de la imagen + gap
  const offset = -currentIndex.value * itemWidth
  return {
    transform: `translateX(${offset}px)`
  }
})

// Alert helpers
function showSuccess(title: string, text: string) {
  Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  })
}

function showError(title: string, text: string) {
  Swal.fire({
    icon: 'error',
    title,
    text,
    timer: 3000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  })
}

function showInfo(title: string, text: string) {
  Swal.fire({
    icon: 'info',
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  })
}

// Lifecycle
onMounted(() => {
  // Initialize component
})
</script>

<style scoped>
/* Page Layout */
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #e0e7ff 100%);
  padding: 32px 16px;
}

.page-content {
  max-width: 72rem;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}

.page-subtitle {
  color: #4b5563;
  font-size: 1.125rem;
  max-width: 42rem;
  margin: 0 auto;
}

/* Upload Section */
.upload-section {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 32px;
  margin-bottom: 32px;
}

.upload-header {
  text-align: center;
  margin-bottom: 24px;
}

.upload-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.upload-description {
  color: #6b7280;
}

.upload-text-primary {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.upload-text-secondary {
  color: #6b7280;
}

.upload-text-success {
  font-size: 1.25rem;
  font-weight: 500;
  color: #059669;
  margin-bottom: 8px;
}

/* Upload Zone */
.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 48px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
}

.upload-zone:hover {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #bfdbfe 0%, #c7d2fe 100%);
}

.upload-zone--active {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #bfdbfe 0%, #c7d2fe 100%);
  transform: scale(1.02);
}

.upload-zone--has-files {
  border-color: #10b981;
  background: linear-gradient(135deg, #d1fae5 0%, #dbeafe 100%);
}

.upload-content {
  text-align: center;
}

.upload-icon {
  margin-bottom: 16px;
}

.upload-text {
  margin-bottom: 24px;
}

.upload-button {
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.upload-button:hover {
  background-color: #2563eb;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.upload-button--success {
  background-color: #10b981;
}

.upload-button--success:hover {
  background-color: #059669;
}

/* Cropper Modal */
.cropper-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cropper-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.cropper-container {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 90%;
  max-width: 32rem;
  position: relative;
  z-index: 10;
  overflow: hidden;
}

.cropper-header {
  padding: 24px 24px 16px;
  text-align: center;
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
}

.cropper-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.cropper-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
}

.cropper-content {
  padding: 24px;
}

.cropper-component {
  width: 100%;
  height: 16rem;
  background-color: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
}

.cropper-actions {
  padding: 16px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background-color: #2563eb;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
}

/* Carousel Section */
.carousel-section {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 32px;
}

.carousel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.carousel-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.carousel-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.carousel-count {
  font-size: 14px;
  color: #6b7280;
}

/* Carousel Container */
.carousel-container {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 20px;
}

.carousel {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 15px;
}

.carousel-item {
  min-width: 250px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.carousel-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-delete-btn:hover {
  background-color: #dc2626;
  transform: scale(1.1);
}

.carousel-item:hover .carousel-delete-btn {
  opacity: 1;
}

/* Carousel Navigation */
.carousel-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.carousel-nav-btn:hover {
  background-color: rgba(0, 0, 0, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.carousel-nav-btn--prev {
  left: 20px;
}

.carousel-nav-btn--next {
  right: 20px;
}

/* Carousel Indicators */
.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.carousel-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #d1d5db;
  cursor: pointer;
  transition: all 0.2s ease;
}

.carousel-indicator:hover {
  background-color: #9ca3af;
}

.carousel-indicator--active {
  background-color: #3b82f6;
  transform: scale(1.2);
}

/* Empty State */
.empty-container {
  text-align: center;
  padding: 64px 0;
}

.empty-state {
  text-align: center;
  padding: 64px 0;
}

.empty-icon {
  width: 96px;
  height: 96px;
  color: #d1d5db;
  margin: 0 auto 16px;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 8px;
}

.empty-description {
  color: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .upload-zone {
    padding: 32px;
  }
  
  .carousel-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .cropper-container {
    width: 95%;
    margin: 16px;
  }
  
  .cropper-actions {
    flex-direction: column;
  }
  
  .carousel-nav-btn {
    width: 40px;
    height: 40px;
  }
  
  .carousel-nav-btn--prev {
    left: 10px;
  }
  
  .carousel-nav-btn--next {
    right: 10px;
  }
}
</style>

