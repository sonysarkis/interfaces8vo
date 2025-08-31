<template>
  <div class="container">
    <h1>¡Sube tu video!</h1>
    <div class="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-center">
    </div>
    <div class="drag-area" @click="openFileDialog" @dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop.prevent="onDrop">
      <p>Arrastra y suelta un video o haz clic para seleccionar</p>
      <input type="file" id="file-input" ref="fileInput" accept="video/*" @change="onFileChange" style="display:none;">
    </div>
    <div v-if="videoPreview" class="video-preview">
      <video :src="videoPreview" controls style="max-width:100%;max-height:300px;"></video>
      <div class="flex gap-3 justify-center mt-3">
        <button @click="addToCarousel" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Agregar al carrusel</button>
        <button @click="reset" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancelar</button>
      </div>
    </div>

    <div v-if="videoStore.userVideos.length" class="videos-list">
      <h2 class="mt-8 mb-4 text-lg font-bold">Videos subidos</h2>
      <div class="gallery-grid">
        <div v-for="(video, idx) in videoStore.userVideos" :key="idx" class="gallery-item">
          <video controls style="width:100%;height:160px;object-fit:cover;">
            <source :src="video.src" :type="video.file.type" />
            <track v-if="video.subtitle1" kind="subtitles" :src="video.subtitle1.src" :label="video.subtitle1.name" srclang="es" />
            <track v-if="video.subtitle2" kind="subtitles" :src="video.subtitle2.src" :label="video.subtitle2.name" srclang="en" />
            <source v-if="video.audio1" :src="video.audio1.src" :type="video.audio1.type" />
            <source v-if="video.audio2" :src="video.audio2.src" :type="video.audio2.type" />
          </video>
          <button class="delete-btn" @click="removeVideo(idx)">&times;</button>
          <div class="video-info mt-2 mb-2">
            <span class="block text-xs text-gray-600 truncate">{{ video.file.name }}</span>
          </div>
          <div class="subtitle-audio-controls">
            <div class="subtitle-group">
              <label class="text-xs font-semibold">Subtítulo 1
                <input type="file" accept=".vtt,.srt" @change="e => selectSubtitle(idx, e, 1)" class="input-file" />
              </label>
              <button v-if="video.subtitle1" @click="removeSubtitle(idx, 1)" class="remove-btn">Quitar</button>
            </div>
            <div class="subtitle-group">
              <label class="text-xs font-semibold">Subtítulo 2
                <input type="file" accept=".vtt,.srt" @change="e => selectSubtitle(idx, e, 2)" class="input-file" />
              </label>
              <button v-if="video.subtitle2" @click="removeSubtitle(idx, 2)" class="remove-btn">Quitar</button>
            </div>
            <div class="audio-group">
              <label class="text-xs font-semibold">Audio 1
                <input type="file" accept="audio/*" @change="e => selectAudio(idx, e, 1)" class="input-file" />
              </label>
              <button v-if="video.audio1" @click="removeAudio(idx, 1)" class="remove-btn">Quitar</button>
            </div>
            <div class="audio-group">
              <label class="text-xs font-semibold">Audio 2
                <input type="file" accept="audio/*" @change="e => selectAudio(idx, e, 2)" class="input-file" />
              </label>
              <button v-if="video.audio2" @click="removeAudio(idx, 2)" class="remove-btn">Quitar</button>
            </div>
          </div>
          <div class="subtitle-style-controls">
            <label class="text-xs font-semibold mr-2">Color subtítulo
              <input type="color" :value="(subtitleStyles[idx] && subtitleStyles[idx].color) || '#ffffff'" @input="e => updateSubtitleStyle(idx, 'color', e.target.value)" class="ml-2 align-middle" />
            </label>
            <label class="text-xs font-semibold ml-4">Tamaño
              <select :value="(subtitleStyles[idx] && subtitleStyles[idx].fontSize) || '20px'" @change="e => updateSubtitleStyle(idx, 'fontSize', e.target.value)" class="ml-2 align-middle">
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
</template>


<script setup>
import { ref, computed } from 'vue';
import { useVideoCarouselStore } from '@/store/videoCarousel';
import Swal from 'sweetalert2';

const fileInput = ref(null);
const videoPreview = ref(null);
const videoFile = ref(null);
const videoStore = useVideoCarouselStore();
const currentIndex = ref(0);
const subtitleInput = ref(null);
const audioInput = ref(null);
const subtitleStyles = ref([]); // [{ color, fontSize }]

function openFileDialog() {
  fileInput.value.click();
}

function onFileChange(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('video/')) {
    videoFile.value = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      videoPreview.value = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function onDragOver(e) {
  e.currentTarget.style.borderColor = '#007bff';
}

function onDragLeave(e) {
  e.currentTarget.style.borderColor = '#ccc';
}

function onDrop(e) {
  e.currentTarget.style.borderColor = '#ccc';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('video/')) {
    videoFile.value = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      videoPreview.value = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function addToCarousel() {
  if (videoPreview.value) {
    videoStore.addVideo({
      src: videoPreview.value,
      title: 'Video subido',
      description: 'Video agregado por el usuario',
      file: {
        name: videoFile.value.name,
        type: videoFile.value.type,
        size: videoFile.value.size
      },
    });
    Swal.fire({
      icon: 'success',
      title: '¡Video agregado!',
      text: 'El video se añadió correctamente al carrusel.',
      timer: 1800,
      showConfirmButton: false
    });
    reset();
  }
}

function reset() {
  videoPreview.value = null;
  videoFile.value = null;
}

async function removeVideo(idx) {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el video y todos sus archivos asociados.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
  if (result.isConfirmed) {
    videoStore.removeVideo(idx);
    if (currentIndex.value > videoStore.userVideos.length - 1) {
      currentIndex.value = Math.max(0, videoStore.userVideos.length - 1);
    }
    Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: 'El video ha sido eliminado.',
      timer: 1500,
      showConfirmButton: false
    });
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function next() {
  if (currentIndex.value < videoStore.userVideos.length - 1) {
    currentIndex.value++;
  }
}

function selectSubtitle(idx, e, num) {
  const file = e.target.files[0];
  if (file && (file.name.endsWith('.vtt') || file.name.endsWith('.srt'))) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (num === 1) {
        videoStore.userVideos[idx].subtitle1 = {
          name: file.name,
          src: ev.target.result,
          type: file.type || 'text/vtt'
        };
      } else {
        videoStore.userVideos[idx].subtitle2 = {
          name: file.name,
          src: ev.target.result,
          type: file.type || 'text/vtt'
        };
      }
      Swal.fire({
        icon: 'success',
        title: 'Subtítulo agregado',
        text: `El subtítulo ${file.name} se ha asociado correctamente.`,
        timer: 1800,
        showConfirmButton: false
      });
    };
    reader.readAsDataURL(file);
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Archivo inválido',
      text: 'Solo se permiten archivos .vtt o .srt',
      timer: 1800,
      showConfirmButton: false
    });
  }
}

function selectAudio(idx, e, num = 1) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('audio/')) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (num === 1) {
        videoStore.userVideos[idx].audio1 = {
          name: file.name,
          src: ev.target.result,
          type: file.type
        };
      } else {
        videoStore.userVideos[idx].audio2 = {
          name: file.name,
          src: ev.target.result,
          type: file.type
        };
      }
      Swal.fire({
        icon: 'success',
        title: 'Audio agregado',
        text: `La pista ${file.name} se ha asociado correctamente.`,
        timer: 1800,
        showConfirmButton: false
      });
    };
    reader.readAsDataURL(file);
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Archivo inválido',
      text: 'Solo se permiten archivos de audio',
      timer: 1800,
      showConfirmButton: false
    });
  }
}

function removeSubtitle(idx, num) {
  if (num === 1 && videoStore.userVideos[idx].subtitle1) {
    videoStore.userVideos[idx].subtitle1 = null;
    Swal.fire({
      icon: 'info',
      title: 'Subtítulo eliminado',
      text: 'El subtítulo 1 ha sido quitado.',
      timer: 1500,
      showConfirmButton: false
    });
  }
  if (num === 2 && videoStore.userVideos[idx].subtitle2) {
    videoStore.userVideos[idx].subtitle2 = null;
    Swal.fire({
      icon: 'info',
      title: 'Subtítulo eliminado',
      text: 'El subtítulo 2 ha sido quitado.',
      timer: 1500,
      showConfirmButton: false
    });
  }
}

function removeAudio(idx, num = 1) {
  if (num === 1 && videoStore.userVideos[idx].audio1) {
    videoStore.userVideos[idx].audio1 = null;
    Swal.fire({
      icon: 'info',
      title: 'Audio eliminado',
      text: 'La pista de audio 1 ha sido quitada.',
      timer: 1500,
      showConfirmButton: false
    });
  }
  if (num === 2 && videoStore.userVideos[idx].audio2) {
    videoStore.userVideos[idx].audio2 = null;
    Swal.fire({
      icon: 'info',
      title: 'Audio eliminado',
      text: 'La pista de audio 2 ha sido quitada.',
      timer: 1500,
      showConfirmButton: false
    });
  }
}

function ensureSubtitleStyle(idx) {
  if (!subtitleStyles.value[idx]) {
    subtitleStyles.value[idx] = { color: '#fff', fontSize: '20px' };
  }
}

function updateSubtitleStyle(idx, key, value) {
  ensureSubtitleStyle(idx);
  subtitleStyles.value[idx][key] = value;
  // Guardar en el objeto del video para que el carrusel lo lea
  if (key === 'color') {
    if (videoStore.userVideos[idx].subtitle1) videoStore.userVideos[idx].subtitle1.color = value;
    if (videoStore.userVideos[idx].subtitle2) videoStore.userVideos[idx].subtitle2.color = value;
  }
  if (key === 'fontSize') {
    if (videoStore.userVideos[idx].subtitle1) videoStore.userVideos[idx].subtitle1.fontSize = value;
    if (videoStore.userVideos[idx].subtitle2) videoStore.userVideos[idx].subtitle2.fontSize = value;
  }
  applySubtitleStyle(idx);
}

function applySubtitleStyle(idx) {
  // Esperar a que el video esté en el DOM
  setTimeout(() => {
    const videoEls = document.querySelectorAll('.gallery-item video');
    const video = videoEls[idx];
    if (video) {
      const style = subtitleStyles.value[idx];
      const sheetId = `subtitle-style-${idx}`;
      let styleEl = document.getElementById(sheetId);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = sheetId;
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = `
        .gallery-item:nth-child(${idx + 1}) video::cue {
          color: ${style.color} !important;
          font-size: ${style.fontSize} !important;
        }
      `;
    }
  }, 100);
}

const carouselStyle = computed(() => {
  const itemWidth = 250 + 15; // Ancho de la "imagen" (video) + gap
  const offset = -currentIndex.value * itemWidth;
  return {
    transform: `translateX(${offset}px)`
  };
});
</script>

<style scoped>
.videos-list {
  margin-top: 30px;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 20px;
}
.gallery-item {
  background: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.08);
  padding: 16px 12px 12px 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.gallery-item video {
  border-radius: 6px;
  margin-bottom: 8px;
}
.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(220, 53, 69, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}
.gallery-item:hover .delete-btn {
  opacity: 1;
}
.video-info {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 6px;
}
.prev-btn, .next-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
  font-size: 20px;
  z-index: 10;
}
.prev-btn {
  left: 10px;
}
.next-btn {
  right: 10px;
}
.subtitle-audio-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
  margin-top: 8px;
}
.subtitle-group, .audio-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.input-file {
  margin-left: 8px;
  font-size: 12px;
  padding: 2px 0;
}
.remove-btn {
  background: #fee2e2;
  color: #b91c1c;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  padding: 2px 8px;
  margin-left: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.remove-btn:hover {
  background: #fecaca;
}
.subtitle-style-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
</style>

<style scoped>
.container {
  background: #eeeeee;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 800px;
  text-align: center;
  margin: 40px auto;
}
.drag-area {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 40px 20px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  margin-bottom: 20px;
}
.drag-area:hover {
  background-color: #e9ecef;
}
input[type="file"] {
  display: initial;
}
.video-preview {
  margin-top: 20px;
}
</style>
