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
    description: 'Resolvemos tus dudas y problemas 24/7 para que nunca te detengas.'
  },
  {
    image: innovacion,
    title: 'Innovación Constante',
    description: 'Siempre implementamos las últimas tecnologías para tu empresa.'
  },
  {
    image: equipo,
    title: 'Trabajo en Equipo',
    description: 'Nuestro equipo multidisciplinario impulsa el éxito de tu proyecto.'
  },
  {
    image: crecimiento,
    title: 'Crecimiento Asegurado',
    description: 'Te ayudamos a escalar tu negocio y alcanzar nuevos mercados.'
  },
  {
    image: seguridad,
    title: 'Seguridad y Confianza',
    description: 'Protegemos tus datos y operaciones con los más altos estándares.'
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
  startAutoSlide();
});

onUnmounted(() => {
  stopAutoSlide();
});
</script>

<template>
  <section class="carousel">
    <div class="carousel-container">
      <div class="carousel-slides">
        <div 
          class="slide" 
          v-for="(slide, i) in slides" 
          :key="slide.title"
          :class="{ active: i === currentSlide }">
          <img :src="slide.image" :alt="slide.title">
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

.carousel-slides {
  height: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.slide.active {
  opacity: 1;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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