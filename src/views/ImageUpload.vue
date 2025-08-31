<template>
  <div class="container">
    <h1>¡Sube tus imagenes!</h1>
    <div class="drag-area" @click="openFileDialog" @dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop.prevent="onDrop">
      <p>Arrastra y suelta imágenes o haz clic para seleccionar</p>
      <input type="file" id="file-input" ref="fileInput" multiple accept="image/*" @change="onFileChange" style="display:none;">
    </div>

    <!-- Cropper Modal -->
    <div v-if="showCropper" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
        <h2 class="mb-4 text-lg font-bold text-center">Recorta tu imagen</h2>
        <cropper
          :src="cropperImage"
          :stencil-props="{ aspectRatio: 1 }"
          ref="cropperRef"
          class="w-full h-64 bg-gray-100 rounded"
        />
        <div class="flex justify-center gap-4 mt-4">
          <button @click="confirmCrop" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Agregar al carrusel</button>
          <button @click="cancelCrop" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancelar</button>
        </div>
      </div>
    </div>

    <div class="carousel-container">
      <div class="carousel" :style="carouselStyle">
        <div v-for="(src, index) in images" :key="index" class="carousel-item">
          <img :src="src" :alt="`Imagen ${index + 1}`">
          <button class="delete-btn" @click="deleteImage(index)">&times;</button>
        </div>
      </div>
      <button class="prev-btn" @click="prev">&lt;</button>
      <button class="next-btn" @click="next">&gt;</button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { useCarouselStore } from '@/store/carousel';


const carouselStore = useCarouselStore();
const images = computed(() => carouselStore.userImages);
const currentIndex = ref(0);
const fileInput = ref(null);

// Cropper state
const showCropper = ref(false);
const cropperImage = ref(null);
const cropperRef = ref(null);
let pendingFiles = [];

function openFileDialog() {
  fileInput.value.click();
}

function onFileChange(e) {
  handleFiles(e.target.files);
}

function onDragOver(e) {
  e.currentTarget.style.borderColor = '#007bff';
}

function onDragLeave(e) {
  e.currentTarget.style.borderColor = '#ccc';
}

function onDrop(e) {
  e.currentTarget.style.borderColor = '#ccc';
  handleFiles(e.dataTransfer.files);
}

function handleFiles(files) {
  pendingFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
  if (pendingFiles.length > 0) {
    const reader = new FileReader();
    reader.onload = (e) => {
      cropperImage.value = e.target.result;
      showCropper.value = true;
    };
    reader.readAsDataURL(pendingFiles[0]);
  }
}

function confirmCrop() {
  if (cropperRef.value) {
    const result = cropperRef.value.getResult();
    if (result && result.canvas) {
      carouselStore.addImage(result.canvas.toDataURL('image/png'));
    }
  }
  // Si hay más archivos pendientes, recortar el siguiente
  pendingFiles.shift();
  if (pendingFiles.length > 0) {
    const reader = new FileReader();
    reader.onload = (e) => {
      cropperImage.value = e.target.result;
      showCropper.value = true;
    };
    reader.readAsDataURL(pendingFiles[0]);
  } else {
    showCropper.value = false;
    cropperImage.value = null;
  }
}

function cancelCrop() {
  showCropper.value = false;
  cropperImage.value = null;
  pendingFiles = [];
}

function deleteImage(index) {
  carouselStore.removeImage(index);
  if (currentIndex.value > images.value.length - 1) {
    currentIndex.value = Math.max(0, images.value.length - 1);
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function next() {
  if (currentIndex.value < images.length - 1) {
    currentIndex.value++;
  }
}

const carouselStyle = computed(() => {
  const itemWidth = 250 + 15; // Ancho de la imagen + gap
  const offset = -currentIndex.value * itemWidth;
  return {
    transform: `translateX(${offset}px)`
  };
});
</script>

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

h1 {
  color: #333;
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
}

.carousel-item img {
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

