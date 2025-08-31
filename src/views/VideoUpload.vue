<template>
  <div class="container">
    <h1>¡Sube tu video!</h1>
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
      <div class="carousel-container">
        <div class="carousel" :style="carouselStyle">
          <div v-for="(video, idx) in videoStore.userVideos" :key="idx" class="carousel-item">
            <video :src="video.src" controls style="width:100%;height:100%;object-fit:cover;"></video>
            <button class="delete-btn" @click="removeVideo(idx)">&times;</button>
            <div class="video-info">
              <span class="block text-xs text-gray-600 truncate">{{ video.file.name }}</span>
            </div>
          </div>
        </div>
        <button class="prev-btn" @click="prev">&lt;</button>
        <button class="next-btn" @click="next">&gt;</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { useVideoCarouselStore } from '@/store/videoCarousel';

const fileInput = ref(null);
const videoPreview = ref(null);
const videoFile = ref(null);
const videoStore = useVideoCarouselStore();
const currentIndex = ref(0);

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
      }
    });
    reset();
  }
}

function reset() {
  videoPreview.value = null;
  videoFile.value = null;
}

function removeVideo(idx) {
  videoStore.removeVideo(idx);
  if (currentIndex.value > videoStore.userVideos.length - 1) {
    currentIndex.value = Math.max(0, videoStore.userVideos.length - 1);
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
.carousel-container {
  position: relative;
  overflow: hidden;
  margin-top: 20px;
  border: 1px solid #363636;
  border-radius: 8px;
  padding: 10px;
}
.carousel {
  display: flex;
  transition: transform 0.5s ease;
  gap: 15px;
}
.carousel-item {
  min-width: 250px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.carousel-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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
.carousel-item:hover .delete-btn {
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
  display: none;
}
.video-preview {
  margin-top: 20px;
}
</style>
