<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

import atencionCliente from '@/assets/images/atencion-cliente.png';
import innovacion from '@/assets/images/innovacion.png';
import equipo from '@/assets/images/equipo.png';
import crecimiento from '@/assets/images/crecimiento.png';
import seguridad from '@/assets/images/seguridad.png';

import { storeToRefs } from 'pinia';
import { useCarouselStore } from '@/store/carousel';

const defaultSlides = [
  {
    image: atencionCliente,
    title: 'Atención al Cliente',
    description: 'Resolvemos tus dudas y problemas 24/7 para que nunca te detengas.',
    file: {
      name: 'atencion-cliente.png',
      type: 'image/png',
      size: 0 // Se actualizará luego
    }
  },
  {
    image: innovacion,
    title: 'Innovación Constante',
    description: 'Siempre implementamos las últimas tecnologías para tu empresa.',
    file: {
      name: 'innovacion.png',
      type: 'image/png',
      size: 0
    }
  },
  {
    image: equipo,
    title: 'Trabajo en Equipo',
    description: 'Nuestro equipo multidisciplinario impulsa el éxito de tu proyecto.',
    file: {
      name: 'equipo.png',
      type: 'image/png',
      size: 0
    }
  },
  {
    image: crecimiento,
    title: 'Crecimiento Asegurado',
    description: 'Te ayudamos a escalar tu negocio y alcanzar nuevos mercados.',
    file: {
      name: 'crecimiento.png',
      type: 'image/png',
      size: 0
    }
  },
  {
    image: seguridad,
    title: 'Seguridad y Confianza',
    description: 'Protegemos tus datos y operaciones con los más altos estándares.',
    file: {
      name: 'seguridad.png',
      type: 'image/png',
      size: 0
    }
  }
];

const carouselStore = useCarouselStore();
const { userImages } = storeToRefs(carouselStore);

const slides = computed(() => {
  // Las imágenes del usuario primero, luego las predeterminadas
  const userSlides = userImages.value.map((img, idx) => {
    // Extraer el peso en bytes del base64
    let size = 0;
    let type = 'image/png';
    if (img.startsWith('data:')) {
      const matches = img.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
      if (matches) {
        type = matches[1];
        // Calcular tamaño en bytes del base64
        const base64str = matches[2];
        size = Math.round((base64str.length * 3) / 4 - (base64str.endsWith('==') ? 2 : base64str.endsWith('=') ? 1 : 0));
      }
    }
    return {
      image: img,
      title: `Imagen subida #${idx + 1}`,
      description: 'Imagen agregada por el usuario',
      file: { name: `user-image-${idx + 1}.png`, type, size }
    };
  });
  return [...userSlides, ...defaultSlides];
});

const currentSlide = ref(0);
let interval: any = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const getVisibleSlides = () => {
  // Devuelve un array con los 3 slides visibles (actual y dos siguientes, con wrap-around)
  const visible = [];
  for (let i = 0; i < 3; i++) {
    visible.push(slides.value[(currentSlide.value + i) % slides.value.length]);
  }
  return visible;
};

// Obtener el peso real de las imágenes (solo en entorno web, usando fetch HEAD)
const setImageSizes = async () => {
  for (const slide of slides.value) {
    try {
      const response = await fetch(slide.image, { method: 'HEAD' });
      const size = response.headers.get('content-length');
      if (size) slide.file.size = Number(size);
    } catch (e) {}
  }
};

const startAutoSlide = () => {
  interval = setInterval(() => {
    nextSlide();
  }, 5000);
};

const stopAutoSlide = () => {
  if (interval) {
    clearInterval(interval);
  }
};

onMounted(() => {
  setImageSizes();
});

// Estado para mostrar el modal de info
const showInfo = ref(false);
const infoData = ref<any>(null);
const openInfo = (slide: any) => {
  // Obtener dimensiones de la imagen
  const img = new window.Image();
  img.onload = function () {
    infoData.value = {
      ...slide,
      dimensions: `${img.naturalWidth} x ${img.naturalHeight}`
    };
    showInfo.value = true;
  };
  img.onerror = function () {
    infoData.value = {
      ...slide,
      dimensions: 'Desconocido'
    };
    showInfo.value = true;
  };
  img.src = slide.image;
};
const closeInfo = () => {
  showInfo.value = false;
};

const formatSize = (size: number) => {
  if (!size) return 'Desconocido';
  if (size < 1024) return size + ' bytes';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  return (size / (1024 * 1024)).toFixed(2) + ' MB';
};
</script>

<template>
  <section class="carousel">
    <div class="carousel-container">
      <div class="carousel-slides slides-row">
        <div 
          class="slide slide-multi" 
          v-for="(slide, i) in getVisibleSlides()" 
          :key="slide.title + '-' + i"
        >
          <div class="img-hover-group">
            <img :src="slide.image" :alt="slide.title">
            <button class="info-btn" @click="openInfo(slide)" tabindex="0">
              ℹ️
            </button>
          </div>
          <div class="slide-content">
            <h2>{{ slide.title }}</h2>
            <p>{{ slide.description }}</p>
          </div>
        </div>
      </div>
      <button class="carousel-control prev" @click="prevSlide">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="carousel-control next" @click="nextSlide">
        <i class="fas fa-chevron-right"></i>
      </button>
      <div class="carousel-indicators">
        <button 
          v-for="(slide, i) in slides"
          :key="`indicator-${slide.title}`"
          :class="{ active: i === currentSlide }"
          @click="goToSlide(i)">
        </button>
      </div>
      <!-- Modal de información -->
      <div v-if="showInfo" class="modal-info">
        <div class="modal-content">
          <button class="close-modal" @click="closeInfo">&times;</button>
          <h3>Información de la imagen</h3>
          <ul v-if="infoData">
            <li><b>Nombre:</b> {{ infoData.file.name }}</li>
            <li><b>Tipo:</b> {{ infoData.file.type }}</li>
            <li><b>Peso:</b> {{ formatSize(infoData.file.size) }}</li>
            <li><b>Dimensión:</b> {{ infoData.dimensions || 'Desconocido' }}</li>
            <li><b>Título:</b> {{ infoData.title }}</li>
            <li><b>Descripción:</b> {{ infoData.description }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel {
  position: relative;
  height: 600px;
  overflow: hidden;
  margin: 2rem 0;
  background: linear-gradient(135deg, var(--color-background) 0%, var(--color-secondary) 20%);
  border-radius: 24px;
  padding: 2rem;
}

.carousel-container {
  position: relative;
  height: 100%;
}

.carousel-slides.slides-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  height: 100%;
  gap: 2rem;
  padding: 0 1rem;
}

.slide.slide-multi {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  max-width: calc(33.333% - 1.33rem);
  height: 100%;
  opacity: 1;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  background: var(--color-background);
  transform: scale(0.95);
  z-index: 1;
}

.slide.slide-multi:hover {
  transform: scale(1);
  z-index: 10;
}

.img-hover-group {
  position: relative;
  width: 100%;
  height: 75%;
  overflow: hidden;
}

.img-hover-group img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide.slide-multi:hover .img-hover-group img {
  transform: scale(1.1);
}

.info-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: var(--color-background);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.img-hover-group:hover .info-btn,
.img-hover-group:focus-within .info-btn {
  opacity: 1;
  transform: translateY(-4px);
}

.info-btn:hover {
  transform: translateY(-4px) scale(1.1);
}

/* Modal de información */
.modal-info {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: var(--color-background);
  padding: 2.5rem 3rem;
  border-radius: 20px;
  min-width: 400px;
  max-width: 90vw;
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.close-modal {
  position: absolute;
  top: 16px;
  right: 20px;
  background: var(--color-secondary);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.5rem;
  color: var(--color-background);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-modal:hover {
  background: var(--color-accent);
  color: var(--color-background);
  transform: scale(1.1);
}

.modal-content h3 {
  color: var(--color-primary);
  font-size: var(--font-subtitle-size);
  font-family: var(--font-subtitle-family);
  font-weight: var(--font-subtitle-weight);
  margin-bottom: 1.5rem;
  text-align: center;
}

.modal-content ul {
  list-style: none;
  padding: 0;
}

.modal-content li {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-secondary);
  color: var(--color-text);
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
}

.modal-content li:last-child {
  border-bottom: none;
}

.modal-content b {
  color: var(--color-primary);
  font-weight: 600;
  margin-right: 0.5rem;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: var(--color-background);
  backdrop-filter: blur(10px);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.slide-content h2, .slide-content p {
  color: var(--color-background);
  margin: 0;
}

.slide-content h2 {
  font-size: var(--font-subtitle-size);
  font-family: var(--font-subtitle-family);
  font-weight: var(--font-subtitle-weight);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.slide-content p {
  font-size: var(--font-body-size);
  font-family: var(--font-body-family);
  line-height: 1.5;
  opacity: 0.95;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border: none;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: var(--color-background);
  backdrop-filter: blur(10px);
  font-size: 1.2rem;
  z-index: 20;
}

.carousel-control:hover {
  transform: translateY(-50%) scale(1.1);
}

.carousel-control.prev {
  left: 2rem;
}

.carousel-control.next {
  right: 2rem;
}

.carousel-indicators {
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  background: var(--color-background);
  padding: 1rem 1.5rem;
  border-radius: 50px;
  backdrop-filter: blur(10px);
  z-index: 15;
}

.carousel-indicators button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
  background: var(--color-background);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.carousel-indicators button:hover {
  background: var(--color-secondary);
  transform: scale(1.2);
}

.carousel-indicators button.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-color: var(--color-primary);
  transform: scale(1.3);
}

/* Responsive */
@media (max-width: 1024px) {
  .carousel {
    height: 500px;
    padding: 1.5rem;
  }
  
  .carousel-slides.slides-row {
    gap: 1.5rem;
  }
  
  .slide-content h2 {
    font-size: 1.25rem;
  }
  
  .slide-content p {
    font-size: 0.875rem;
  }
}

@media (max-width: 768px) {
  .carousel {
    height: 450px;
    padding: 1rem;
  }
  
  .carousel-slides.slides-row {
    gap: 1rem;
  }
  
  .carousel-control {
    width: 48px;
    height: 48px;
  }
  
  .carousel-control.prev {
    left: 1rem;
  }
  
  .carousel-control.next {
    right: 1rem;
  }
  
  .carousel-indicators {
    bottom: -0.75rem;
    padding: 0.75rem 1.25rem;
  }
}
</style>