<template>
  <div class="page-container">
    <div class="page-content">
      <!-- Header Section -->
      <div class="page-header">
        <h1 class="page-title">
          🎥 Sube tu Video
        </h1>
        <p class="page-subtitle">
          Comparte tus videos con subtítulos personalizables y múltiples pistas de audio
        </p>
    </div>

      <!-- Upload Section -->
      <div class="upload-section">
        <div class="upload-header">
          <h2 class="upload-title">Área de Carga</h2>
          <p class="upload-description">Arrastra y suelta tu video o haz clic para seleccionar</p>
    </div>

        <!-- Drag & Drop Area -->
        <div 
          class="upload-zone"
          :class="{ 'upload-zone--active': isDragOver, 'upload-zone--has-file': videoFile }"
          @click="openFileDialog"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
        >
          <div class="upload-content">
            <div class="upload-icon">
              <svg v-if="!videoFile" class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <svg v-else class="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
      </div>
            
                      <div v-if="!videoFile" class="upload-text">
            <p class="upload-text-primary">Selecciona un archivo de video</p>
            <p class="upload-text-secondary">MP4, AVI, MOV, o cualquier formato de video</p>
    </div>

          <div v-else class="upload-text">
            <p class="upload-text-success">{{ videoFile.name }}</p>
            <p class="upload-text-secondary">{{ formatFileSize(videoFile.size) }}</p>
          </div>

            <button 
              v-if="!videoFile"
              class="upload-button"
              @click.stop="openFileDialog"
            >
              Seleccionar Video
            </button>
          </div>

          <input 
            ref="fileInput"
            type="file" 
            accept="video/*" 
            @change="onFileChange" 
            class="hidden"
          />
        </div>

        <!-- Video Preview -->
        <div v-if="videoPreview" class="video-preview-section">
          <div class="video-container">
            <video 
              :src="videoPreview" 
              controls 
              class="video-player"
              preload="metadata"
            ></video>
          </div>
          
          <div class="video-actions">
            <button 
              @click="addToCarousel" 
              class="btn btn-primary"
              :disabled="isUploading"
            >
              <svg v-if="!isUploading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isUploading ? 'Agregando...' : 'Agregar al Carrusel' }}
            </button>
            
            <button @click="reset" class="btn btn-secondary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Videos List -->
      <div v-if="videoStore.userVideos.length" class="videos-section">
        <div class="videos-header">
          <h2 class="videos-title">📚 Biblioteca de Videos</h2>
          <div class="videos-info">
            <span class="videos-count">{{ videoStore.userVideos.length }} video{{ videoStore.userVideos.length !== 1 ? 's' : '' }}</span>
            <button 
              @click="clearAllVideos" 
              class="btn btn-danger btn-sm"
              v-if="videoStore.userVideos.length > 1"
            >
              Limpiar Todo
            </button>
          </div>
        </div>

        <div class="videos-grid">
          <div 
            v-for="(video, idx) in videoStore.userVideos" 
            :key="idx" 
            class="video-card"
          >
                         <!-- Video Player -->
             <div class="video-card-header">
               <video 
                 ref="videoPlayer"
                 controls 
                 class="video-card-player"
                 preload="metadata"
                 @loadedmetadata="onVideoLoaded(idx)"
               >
            <source :src="video.src" :type="video.file.type" />
                 <track 
                   v-if="video.subtitle1" 
                   kind="subtitles" 
                   :src="video.subtitle1.src" 
                   :label="video.subtitle1.name" 
                   srclang="es" 
                 />
                 <track 
                   v-if="video.subtitle2" 
                   kind="subtitles" 
                   :src="video.subtitle2.src" 
                   :label="video.subtitle2.name" 
                   srclang="en" 
                 />
          </video>
               
               <!-- Audio Track Selector -->
               <div v-if="hasMultipleAudioTracks(video)" class="audio-track-selector">
                 <label class="audio-track-label">
                   <span>🎵 Pista de Audio:</span>
                   <select 
                     @change="changeAudioTrack(idx, $event)"
                     class="audio-track-select"
                   >
                     <option value="original">Original</option>
                     <option v-if="video.audio1" value="audio1">{{ video.audio1.name }}</option>
                     <option v-if="video.audio2" value="audio2">{{ video.audio2.name }}</option>
                   </select>
                 </label>
          </div>
              
              <!-- Delete Button -->
              <button 
                @click="removeVideo(idx)" 
                class="video-delete-btn"
                title="Eliminar video"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>

            <!-- Video Info -->
            <div class="video-card-info">
              <h3 class="video-title">{{ video.file.name }}</h3>
              <p class="video-meta">{{ formatFileSize(video.file.size) }} • {{ video.file.type }}</p>
            </div>

            <!-- Subtitle Controls -->
            <div class="video-controls">
              <div class="control-section">
                <h4 class="control-title">🎬 Subtítulos</h4>
                <div class="control-grid">
                  <div class="control-item">
                    <label class="control-label">
                      <span>Subtítulo 1</span>
                      <input 
                        type="file" 
                        accept=".vtt,.srt" 
                        @change="e => selectSubtitle(idx, e, 1)" 
                        class="control-input"
                      />
              </label>
                    <button 
                      v-if="video.subtitle1" 
                      @click="removeSubtitle(idx, 1)" 
                      class="control-remove-btn"
                      title="Quitar subtítulo 1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
            </div>
                  
                  <div class="control-item">
                    <label class="control-label">
                      <span>Subtítulo 2</span>
                      <input 
                        type="file" 
                        accept=".vtt,.srt" 
                        @change="e => selectSubtitle(idx, e, 2)" 
                        class="control-input"
                      />
              </label>
                    <button 
                      v-if="video.subtitle2" 
                      @click="removeSubtitle(idx, 2)" 
                      class="control-remove-btn"
                      title="Quitar subtítulo 2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
            </div>
                </div>
              </div>

              <!-- Audio Controls -->
              <div class="control-section">
                <h4 class="control-title">🔊 Audio</h4>
                <div class="control-grid">
                  <div class="control-item">
                    <label class="control-label">
                      <span>Pista 1</span>
                      <input 
                        type="file" 
                        accept="audio/*" 
                        @change="e => selectAudio(idx, e, 1)" 
                        class="control-input"
                      />
              </label>
                    <button 
                      v-if="video.audio1" 
                      @click="removeAudio(idx, 1)" 
                      class="control-remove-btn"
                      title="Quitar audio 1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
            </div>
                  
                  <div class="control-item">
                    <label class="control-label">
                      <span>Pista 2</span>
                      <input 
                        type="file" 
                        accept="audio/*" 
                        @change="e => selectAudio(idx, e, 2)" 
                        class="control-input"
                      />
              </label>
                    <button 
                      v-if="video.audio2" 
                      @click="removeAudio(idx, 2)" 
                      class="control-remove-btn"
                      title="Quitar audio 2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
            </div>
          </div>
              </div>

              <!-- Subtitle Styling -->
              <div class="control-section">
                <h4 class="control-title">🎨 Estilo de Subtítulos</h4>
                <div class="style-controls">
                  <div class="style-control">
                    <label class="style-label">
                      <span>Color</span>
                                              <input 
                          type="color" 
                          :value="getSubtitleStyle(idx, 'color')" 
                          @input="e => updateSubtitleStyle(idx, 'color', (e.target as HTMLInputElement).value)" 
                          class="style-color-input"
                        />
            </label>
                  </div>
                  
                  <div class="style-control">
                    <label class="style-label">
                      <span>Tamaño</span>
                                              <select 
                          :value="getSubtitleStyle(idx, 'fontSize')" 
                          @change="e => updateSubtitleStyle(idx, 'fontSize', (e.target as HTMLSelectElement).value)" 
                          class="style-select"
                        >
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="28px">28px</option>
                <option value="32px">32px</option>
              </select>
            </label>
          </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-container">
        <div class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          <h3 class="empty-title">No hay videos aún</h3>
          <p class="empty-description">Sube tu primer video para comenzar a crear tu biblioteca</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useVideoCarouselStore } from '@/store/videoCarousel'
import Swal from 'sweetalert2'

// Refs
const fileInput = ref<HTMLInputElement | null>(null)
const videoPreview = ref<string | null>(null)
const videoFile = ref<File | null>(null)
const isDragOver = ref(false)
const isUploading = ref(false)
const subtitleStyles = ref<Array<{ color: string; fontSize: string }>>([])
const videoPlayers = ref<HTMLVideoElement[]>([])
const currentAudioTracks = ref<Array<string>>([])

// Store
const videoStore = useVideoCarouselStore()

// Computed
const hasVideos = computed(() => videoStore.userVideos.length > 0)

// Methods
function openFileDialog() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file && file.type.startsWith('video/')) {
    handleVideoFile(file)
  } else if (file) {
    showError('Archivo inválido', 'Por favor selecciona un archivo de video válido.')
  }
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
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('video/')) {
      handleVideoFile(file)
    } else {
      showError('Archivo inválido', 'Por favor arrastra un archivo de video válido.')
    }
  }
}

function handleVideoFile(file: File) {
  videoFile.value = file
  
  // Validar tamaño del archivo (máximo 100MB)
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    showError('Archivo muy grande', 'El archivo no puede superar los 100MB.')
    return
  }
  
  const reader = new FileReader()
    reader.onload = (ev) => {
    videoPreview.value = ev.target?.result as string
  }
  reader.readAsDataURL(file)
}

async function addToCarousel() {
  if (!videoPreview.value || !videoFile.value) return
  
  isUploading.value = true
  
  try {
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    videoStore.addVideo({
      src: videoPreview.value,
      title: 'Video subido',
      description: 'Video agregado por el usuario',
      file: {
        name: videoFile.value.name,
        type: videoFile.value.type,
        size: videoFile.value.size
      },
    })
    
    showSuccess('¡Video agregado!', 'El video se añadió correctamente al carrusel.')
    reset()
  } catch (error) {
    showError('Error', 'Hubo un problema al agregar el video.')
  } finally {
    isUploading.value = false
  }
}

function reset() {
  videoPreview.value = null
  videoFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function removeVideo(idx: number) {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el video y todos sus archivos asociados.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    videoStore.removeVideo(idx)
    showSuccess('Eliminado', 'El video ha sido eliminado correctamente.')
  }
}

async function clearAllVideos() {
  const result = await Swal.fire({
    title: '¿Eliminar todos los videos?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar todo',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    videoStore.clearVideos()
    showSuccess('Biblioteca limpiada', 'Todos los videos han sido eliminados.')
  }
}

function selectSubtitle(idx: number, e: Event, num: number) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file && (file.name.endsWith('.vtt') || file.name.endsWith('.srt'))) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const subtitleData = {
          name: file.name,
        src: ev.target?.result as string,
          type: file.type || 'text/vtt'
      }
      
      if (num === 1) {
        videoStore.userVideos[idx].subtitle1 = subtitleData
      } else {
        videoStore.userVideos[idx].subtitle2 = subtitleData
      }
      
      showSuccess('Subtítulo agregado', `El subtítulo ${file.name} se ha asociado correctamente.`)
    }
    reader.readAsDataURL(file)
  } else {
    showError('Archivo inválido', 'Solo se permiten archivos .vtt o .srt')
  }
}

function selectAudio(idx: number, e: Event, num: number) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file && file.type.startsWith('audio/')) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const audioData = {
          name: file.name,
        src: ev.target?.result as string,
          type: file.type
      }
      
      if (num === 1) {
        videoStore.userVideos[idx].audio1 = audioData
      } else {
        videoStore.userVideos[idx].audio2 = audioData
      }
      
      // Force re-render to show audio track selector
      nextTick(() => {
        // Update the audio track selector if it exists
        const audioSelector = document.querySelector(`.video-card:nth-child(${idx + 1}) .audio-track-select`)
        if (audioSelector) {
          // Trigger change event to update the selector
          const event = new Event('change', { bubbles: true })
          audioSelector.dispatchEvent(event)
        }
      })
      
      showSuccess('Audio agregado', `La pista ${file.name} se ha asociado correctamente.`)
    }
    reader.readAsDataURL(file)
  } else {
    showError('Archivo inválido', 'Solo se permiten archivos de audio')
  }
}

function removeSubtitle(idx: number, num: number) {
  if (num === 1 && videoStore.userVideos[idx].subtitle1) {
    videoStore.userVideos[idx].subtitle1 = null
    showInfo('Subtítulo eliminado', 'El subtítulo 1 ha sido quitado.')
  }
  if (num === 2 && videoStore.userVideos[idx].subtitle2) {
    videoStore.userVideos[idx].subtitle2 = null
    showInfo('Subtítulo eliminado', 'El subtítulo 2 ha sido quitado.')
  }
}

function removeAudio(idx: number, num: number) {
  if (num === 1 && videoStore.userVideos[idx].audio1) {
    videoStore.userVideos[idx].audio1 = null
    showInfo('Audio eliminado', 'La pista de audio 1 ha sido quitada.')
  }
  if (num === 2 && videoStore.userVideos[idx].audio2) {
    videoStore.userVideos[idx].audio2 = null
    showInfo('Audio eliminado', 'La pista de audio 2 ha sido quitada.')
  }
}

function getSubtitleStyle(idx: number, key: 'color' | 'fontSize'): string {
  if (!subtitleStyles.value[idx]) {
    subtitleStyles.value[idx] = { color: '#ffffff', fontSize: '20px' }
  }
  return subtitleStyles.value[idx][key]
}

function updateSubtitleStyle(idx: number, key: 'color' | 'fontSize', value: string) {
  if (!subtitleStyles.value[idx]) {
    subtitleStyles.value[idx] = { color: '#ffffff', fontSize: '20px' }
  }
  
  subtitleStyles.value[idx][key] = value
  
  // Aplicar estilos a los subtítulos del video
  if (key === 'color') {
    if (videoStore.userVideos[idx].subtitle1) videoStore.userVideos[idx].subtitle1.color = value
    if (videoStore.userVideos[idx].subtitle2) videoStore.userVideos[idx].subtitle2.color = value
  }
  if (key === 'fontSize') {
    if (videoStore.userVideos[idx].subtitle1) videoStore.userVideos[idx].subtitle1.fontSize = value
    if (videoStore.userVideos[idx].subtitle2) videoStore.userVideos[idx].subtitle2.fontSize = value
  }
  
  applySubtitleStyle(idx)
}

function applySubtitleStyle(idx: number) {
  setTimeout(() => {
    const videoEls = document.querySelectorAll('.video-card-player')
    const video = videoEls[idx] as HTMLVideoElement
    if (video) {
      const style = subtitleStyles.value[idx]
      const sheetId = `subtitle-style-${idx}`
      let styleEl = document.getElementById(sheetId)
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = sheetId
        document.head.appendChild(styleEl)
      }
      styleEl.textContent = `
        .video-card:nth-child(${idx + 1}) .video-card-player::cue {
          color: ${style.color} !important;
          font-size: ${style.fontSize} !important;
        }
      `
    }
  }, 100)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Audio track management functions
function hasMultipleAudioTracks(video: any): boolean {
  return !!(video.audio1 || video.audio2)
}

function onVideoLoaded(idx: number) {
  // Store reference to video player
  const videoEl = document.querySelector(`.video-card:nth-child(${idx + 1}) .video-card-player`) as HTMLVideoElement
  if (videoEl) {
    videoPlayers.value[idx] = videoEl
    // Initialize with original audio track
    currentAudioTracks.value[idx] = 'original'
  }
}

function changeAudioTrack(idx: number, event: Event) {
  const target = event.target as HTMLSelectElement
  const selectedTrack = target.value
  const video = videoStore.userVideos[idx]
  
  if (!video) return
  
  // Store current playback time
  const currentTime = videoPlayers.value[idx]?.currentTime || 0
  const wasPlaying = !videoPlayers.value[idx]?.paused
  
  // Remove existing audio sources
  const videoEl = videoPlayers.value[idx]
  if (videoEl) {
    // Remove all audio sources
    const audioSources = videoEl.querySelectorAll('source[type^="audio/"]')
    audioSources.forEach(source => source.remove())
    
    // Add selected audio track
    if (selectedTrack === 'audio1' && video.audio1) {
      const audioSource = document.createElement('source')
      audioSource.src = video.audio1.src
      audioSource.type = video.audio1.type
      videoEl.appendChild(audioSource)
    } else if (selectedTrack === 'audio2' && video.audio2) {
      const audioSource = document.createElement('source')
      audioSource.src = video.audio2.src
      audioSource.type = video.audio2.type
      videoEl.appendChild(audioSource)
    }
    
    // Update current audio track
    currentAudioTracks.value[idx] = selectedTrack
    
    // Reload video to apply new audio track
    videoEl.load()
    
    // Restore playback position and state
    videoEl.addEventListener('loadedmetadata', () => {
      videoEl.currentTime = currentTime
      if (wasPlaying) {
        videoEl.play().catch(() => {
          // Handle autoplay restrictions
          console.log('Autoplay prevented')
        })
      }
    }, { once: true })
    
    showSuccess('Pista de audio cambiada', `Ahora reproduciendo: ${getAudioTrackName(selectedTrack, video)}`)
  }
}

function getAudioTrackName(track: string, video: any): string {
  switch (track) {
    case 'original':
      return 'Audio Original'
    case 'audio1':
      return video.audio1?.name || 'Pista 1'
    case 'audio2':
      return video.audio2?.name || 'Pista 2'
    default:
      return 'Desconocido'
  }
}

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
  // Inicializar estilos de subtítulos
  subtitleStyles.value = videoStore.userVideos.map(() => ({ color: '#ffffff', fontSize: '20px' }))
})
</script>

<style scoped>
/* Upload Zone */
.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 48px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.upload-zone:hover {
  border-color: #60a5fa;
  background-color: #eff6ff;
}

.upload-zone--active {
  border-color: #3b82f6;
  background-color: #dbeafe;
  transform: scale(1.05);
}

.upload-zone--has-file {
  border-color: #34d399;
  background-color: #ecfdf5;
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
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.upload-button:hover {
  background-color: #1d4ed8;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Video Preview */
.video-preview-section {
  margin-top: 32px;
}

.video-container {
  margin-bottom: 24px;
}

.video-player {
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.video-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
}

@media (min-width: 640px) {
  .video-actions {
    flex-direction: row;
  }
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
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background-color: #1d4ed8;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
}

.btn-danger:hover {
  background-color: #b91c1c;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
}

/* Videos Grid */
.videos-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  margin-top: 20px;
}

@media (min-width: 768px) {
  .videos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .videos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.video-card {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.video-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.video-card-header {
  position: relative;
  margin-bottom: 16px;
}

.video-card-player {
  width: 100%;
  height: 192px;
  object-fit: cover;
  border-radius: 8px;
}

.video-delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  padding: 8px;
  transition: all 0.2s ease;
  opacity: 0;
}

.video-delete-btn:hover {
  background-color: #dc2626;
}

.video-card:hover .video-delete-btn {
  opacity: 1;
}

/* Audio Track Selector */
.audio-track-selector {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 6px;
  padding: 8px 12px;
  z-index: 10;
}

.audio-track-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.audio-track-select {
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  color: #1f2937;
  cursor: pointer;
  min-width: 120px;
}

.audio-track-select:hover {
  background-color: white;
}

.audio-track-select:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.video-card-info {
  margin-bottom: 16px;
}

.video-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-meta {
  font-size: 14px;
  color: #6b7280;
}

/* Controls */
.video-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-section {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.control-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.control-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.control-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
}

.control-input {
  font-size: 12px;
}

.control-remove-btn {
  padding: 4px;
  color: #ef4444;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.control-remove-btn:hover {
  color: #dc2626;
  background-color: #fef2f2;
}

/* Style Controls */
.style-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.style-control {
  display: flex;
  flex-direction: column;
}

.style-label {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 8px;
}

.style-color-input {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  cursor: pointer;
}

.style-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

/* Page Layout */
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%);
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
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
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

/* Videos Section */
.videos-section {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 32px;
}

.videos-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.videos-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.videos-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.videos-count {
  font-size: 14px;
  color: #6b7280;
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
  
  .videos-grid {
    grid-template-columns: 1fr;
  }
  
  .style-controls {
    grid-template-columns: 1fr;
  }
  
  .videos-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
