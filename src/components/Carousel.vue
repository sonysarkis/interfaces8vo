<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

import atencionCliente from '@/assets/images/atencion-cliente.png';
import innovacion from '@/assets/images/innovacion.png';
import equipo from '@/assets/images/equipo.png';
import crecimiento from '@/assets/images/crecimiento.png';
import seguridad from '@/assets/images/seguridad.png';

const slides = [
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

const currentSlide = ref(0);
let interval: any = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const getVisibleSlides = () => {
  // Devuelve un array con los 3 slides visibles (actual y dos siguientes, con wrap-around)
  const visible = [];
  for (let i = 0; i < 3; i++) {
    visible.push(slides[(currentSlide.value + i) % slides.length]);
  }
  return visible;
};

// Obtener el peso real de las imágenes (solo en entorno web, usando fetch HEAD)
const setImageSizes = async () => {
  for (const slide of slides) {
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
  startAutoSlide();
});

onUnmounted(() => {
  stopAutoSlide();
});

// Estado para mostrar el modal de info
const showInfo = ref(false);
const infoData = ref<any>(null);
const openInfo = (slide: any) => {
  infoData.value = slide;
  showInfo.value = true;
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
  height: 500px;
  overflow: hidden;
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
  gap: 1rem;
}

.slide.slide-multi {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  max-width: 32%;
  height: 100%;
  opacity: 1;
  transition: transform 0.5s;
  display: flex;
  flex-direction: column;
}


.img-hover-group {
  position: relative;
  width: 100%;
  height: 70%;
}
.img-hover-group img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.info-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
  font-size: 1.3rem;
  z-index: 2;
}
.img-hover-group:hover .info-btn,
.img-hover-group:focus-within .info-btn {
  opacity: 1;
}

/* Modal de información */
.modal-info {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  position: relative;
}
.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #333;
  cursor: pointer;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: var(--color-primary);
  color: var(--color-background);
}

.slide-content h2, .slide-content p {
  color: var(--color-background);
}

.slide-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-primary);
  border: 2px solid var(--color-primary);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  color: var(--color-background);
}

.carousel-control:hover {
  background: var(--color-background);
  color: var(--color-primary);
  border: 2px solid var(--color-background);
}

.carousel-control.prev {
  left: 1rem;
}

.carousel-control.next {
  right: 1rem;
}

.carousel-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.carousel-indicators button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
  background: var(--color-background);
  cursor: pointer;
  transition: background-color 0.2s;
}

.carousel-indicators button.active {
  background: var(--color-primary);
  border: 2px solid var(--color-background);
}
</style>