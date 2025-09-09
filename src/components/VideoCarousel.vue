<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useVideoCarouselStore } from '@/store/videoCarousel';


import video1 from '@/assets/videos/video1.mp4';
import video2 from '@/assets/videos/video2.mp4';
import video3 from '@/assets/videos/video3.mp4';
import video4 from '@/assets/videos/video4.mp4';

const defaultVideos = [
  {
    src: video1,
    title: 'Video 1',
    description: 'Descripción del video 1',
    file: {
      name: 'video1.mp4',
      type: 'video/mp4',
      size: 0
    }
  },
  {
    src: video2,
    title: 'Video 2',
    description: 'Descripción del video 2',
    file: {
      name: 'video2.mp4',
      type: 'video/mp4',
      size: 0
    }
  },
  {
    src: video3,
    title: 'Video 3',
    description: 'Descripción del video 3',
    file: {
      name: 'video3.mp4',
      type: 'video/mp4',
      size: 0
    }
  },
  {
    src: video4,
    title: 'Video 4',
    description: 'Descripción del video 4',
    file: {
      name: 'video4.mp4',
      type: 'video/mp4',
      size: 0
    }
  }
];

const currentSlide = ref(0);
let interval: any = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % videos.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + videos.value.length) % videos.value.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const getVisibleSlides = () => {
  const visible = [];
  for (let i = 0; i < 3; i++) {
    visible.push(videos.value[(currentSlide.value + i) % videos.value.length]);
  }
  return visible;
};

const setVideoSizes = async () => {
  for (const video of defaultVideos) {
    try {
      const response = await fetch(video.src, { method: 'HEAD' });
      const size = response.headers.get('content-length');
      if (size) video.file.size = Number(size);
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

const videoStore = useVideoCarouselStore();
const { userVideos } = storeToRefs(videoStore);

const videos = computed(() => {
  // Videos del usuario primero, luego los predeterminados
  return [...userVideos.value, ...defaultVideos];
});

onMounted(() => {
  setVideoSizes();
});

const showInfo = ref(false);
const infoData = ref<any>(null);
const openInfo = (video: any) => {
  infoData.value = video;
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

// Sincronizar estilos de subtítulos personalizados
function applySubtitleStyle(idx: number, color: string, fontSize: string) {
  nextTick(() => {
    const videoEls = document.querySelectorAll('.img-hover-group video');
    const video = videoEls[idx];
    if (video) {
      const sheetId = `carousel-subtitle-style-${idx}`;
      let styleEl = document.getElementById(sheetId);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = sheetId;
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = `
        .carousel-slides .slide:nth-child(${idx + 1}) video::cue {
          color: ${color} !important;
          font-size: ${fontSize} !important;
        }
      `;
    }
  });
}

// Observar cambios en los videos del usuario para aplicar estilos
watch(userVideos, (newVideos) => {
  newVideos.forEach((video, idx) => {
    // Prioridad: subtitle1, luego subtitle2
    let color = '#fff';
    let fontSize = '20px';
    if (video && video.subtitle1 && video.subtitle1.color && video.subtitle1.fontSize) {
      color = video.subtitle1.color;
      fontSize = video.subtitle1.fontSize;
    } else if (video && video.subtitle2 && video.subtitle2.color && video.subtitle2.fontSize) {
      color = video.subtitle2.color;
      fontSize = video.subtitle2.fontSize;
    }
    applySubtitleStyle(idx, color, fontSize);
  });
}, { deep: true, immediate: true });
</script>

<template>
  <section class="carousel">
    <div class="carousel-container">
      <div class="carousel-slides slides-row">
        <div 
          class="slide slide-multi" 
          v-for="(video, i) in getVisibleSlides()" 
          :key="video.title + '-' + i"
        >
          <div class="img-hover-group">
            <video :src="video.src" controls :alt="video.title" style="width:100%;height:100%;object-fit:cover;">
              <track v-if="video.subtitle1" kind="subtitles" :src="video.subtitle1.src" :label="video.subtitle1.name" srclang="es" />
              <track v-if="video.subtitle2" kind="subtitles" :src="video.subtitle2.src" :label="video.subtitle2.name" srclang="en" />
            </video>
            <button class="info-btn" @click="openInfo(video)" tabindex="0">
              ℹ️
            </button>
          </div>
          <div class="slide-content">
            <h2>{{ video.title }}</h2>
            <p>{{ video.description }}</p>
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
          v-for="(video, i) in videos"
          :key="`indicator-${video.title}`"
          :class="{ active: i === currentSlide }"
          @click="goToSlide(i)">
        </button>
      </div>
      <!-- Modal de información -->
      <div v-if="showInfo" class="modal-info">
        <div class="modal-content">
          <button class="close-modal" @click="closeInfo">&times;</button>
          <h3>Información del video</h3>
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

.img-hover-group video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 20px 20px 0 0;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide.slide-multi:hover .img-hover-group video {
  transform: scale(1.05);
}

.info-btn {
  position: absolute;
  top: 16px;
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
