
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
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
            <video :src="video.src" controls :alt="video.title" style="width:100%;height:100%;object-fit:cover;"></video>
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
.img-hover-group video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.info-btn {
  position: absolute;
  top: 10px;
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
</style>
