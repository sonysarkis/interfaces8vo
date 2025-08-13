<template>
  <div class="container">
    <div class="video-carousel">
      <div
        v-for="(video, idx) in videos"
        :key="idx"
        class="video-slide"
      >
        <video
          :data-idx="idx"
          ref="el => videoRefs[idx] = el"
          :src="video.src"
          controls
          muted
        >
          <track
            v-for="(track, tIdx) in video.tracks"
            :key="tIdx"
            :kind="track.kind"
            :srclang="track.srclang"
            :label="track.label"
            :src="track.src"
            :default="track.srclang === 'es'"
          />
        </video>
        <button class="info-button" @click="toggleInfo(idx)">
          {{ infoVisible[idx] ? 'Ocultar Información' : 'Ver Información' }}
        </button>
        <div class="info-box" v-show="infoVisible[idx]">
          <p v-if="videoInfo[idx]">
            <strong>Nombre:</strong> {{ videoInfo[idx].fileName }}<br>
            <strong>Formato:</strong> {{ videoInfo[idx].format }}<br>
            <strong>Peso:</strong> {{ videoInfo[idx].sizeKB }} KB / {{ videoInfo[idx].sizeMB }} MB
          </p>
          <p v-else>No se pudo obtener la información del video.</p>
        </div>
  <!-- Solo el botón de ver información permanece debajo del video -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import $ from 'jquery';
import 'slick-carousel';

const videos = [
  {
    src: 'https://videos.pexels.com/video-files/4114797/4114797-uhd_2560_1440_25fps.mp4',
    tracks: [
      { kind: 'subtitles', srclang: 'es', label: 'Español', src: 'data:text/vtt;base64,V0VCVlRUCgowMDowMDowMS4wMDAgLS0+IDAwOjAwOjEwLjAwMApFc3RlIGVzIGVsIGNvbWllbnpvIGRlbCB2aWRlbyBlbiBlc3Bhw7FvbC4gRGlzZnJ1dGEgZGUgbGEgZGVtb3N0cmFjacOzbiBkZSBzdWJ0w610dWxvcyBwZXJzb25hbGl6YWJsZXMuCgowMDowMDoxMC4wMDAgLS0+IDAwOjAwOjIwLjAwMApDb250aW51YW1vcyBjb24gbcOhcyBjb250ZW5pZG8gZW4gZXNwYcOxb2wuIExvcyBzdWJ0w610dWxvcyBwdWVkZW4gc2VyIG1vZGlmaWNhZG9zIGVuIGFwYXJpZW5jaWEgeSBmb3JtYXRvLgoKMDA6MDA6MjAuMDAwIC0tPiAwMDowMTozMC4wMDAKU3VidMOtdHVsb3MgcGVyc29uYWxpemFibGVzOiBwdWVkZXMgY2FtYmlhciBlbCBjb2xvciwgZWwgdGFtYcOxbywgbGEgZm9udGUgeSBtw6FzIG9wY2lvbmVzIGRlIGVzdGlsby4KCjAwOjAxOjMwLjAwMCAtLT4gMDA6MDI6MDAuMDAwRmluIGRlIGxhIGRlbW9zdHJhY2nDs24gZGUgbG9zIHN1YnTDrXR1bG9zIHBlcnNvbmFsaXphYmxlcy4gRXNwZXJhbW9zIHF1ZSB0ZSBoYXlhbiBzaWRvIMO6dGlsZXMu'
      },
      { kind: 'subtitles', srclang: 'en', label: 'English', src: 'data:text/vtt;base64,V0VCVlRUCgowMDowMDowMS4wMDAgLS0+IDAwOjAwOjEwLjAwMApUaGlzIGlzIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHZpZGVvIGluIEVuZ2xpc2guIEVuam95IHRoZSBkZW1vbnN0cmF0aW9uIG9mIGN1c3RvbWl6YWJsZSBzdWJ0aXRsZXMuCgowMDowMDoxMC4wMDAgLS0+IDAwOjAwOjIwLjAwMApUaGUgdmlkZW8gY29udGludWVzIGluIEVuZ2xpc2guIFlvdSBjYW4gbW9kaWZ5IHRoZSBhcHBlYXJhbmNlIG9mIHRoZSBzdWJ0aXRsZXMgdG8geW91ciBsaWtpbmcuCgowMDowMDoyMC4wMDAgLS0+IDAwOjAxOjMwLjAwMApDdXN0b21pemFibGUgc3VidGl0bGVzOiB5b3UgY2FuIGNoYW5nZSB0aGUgY29sb3IsIHNpemUsIGZvbnQsIGFuZCBvdGhlciBzdHlsZSBvcHRpb25zIGZvciBiZXR0ZXIgcmVhZGFiaWxpdHkuCgowMDowMTozMC4wMDAgLS0+IDAwOjAyOjAwLjAwMEVuZCBvZiB0aGUgY3VzdG9taXphYmxlIHN1YnRpdGxlcyBkZW1vbnN0cmF0aW9uLiBXZSBob3BlIHlvdSBmb3VuZCBpdCB1c2VmdWwu'
      }
    ]
  },
  {
    src: 'https://videos.pexels.com/video-files/9244196/9244196-hd_1920_1080_25fps.mp4',
    tracks: [
      { kind: 'subtitles', srclang: 'es', label: 'Español', src: 'data:text/vtt;base64,V0VCVlRUCgowMDowMDowMS4wMDAgLS0+IDAwOjAwOjEwLjAwMApFc3RlIGVzIGVsIGNvbWllbnpvIGRlbCB2aWRlbyBlbiBlc3Bhw7FvbC4gRGlzZnJ1dGEgZGUgbGEgZGVtb3N0cmFjacOzbiBkZSBzdWJ0w610dWxvcyBwZXJzb25hbGl6YWJsZXMuCgowMDowMDoxMC4wMDAgLS0+IDAwOjAwOjIwLjAwMApDb250aW51YW1vcyBjb24gbcOhcyBjb250ZW5pZG8gZW4gZXNwYcOxb2wuIExvcyBzdWJ0w610dWxvcyBwdWVkZW4gc2VyIG1vZGlmaWNhZG9zIGVuIGFwYXJpZW5jaWEgeSBmb3JtYXRvLgoKMDA6MDA6MjAuMDAwIC0tPiAwMDowMTozMC4wMDAKU3VidMOtdHVsb3MgcGVyc29uYWxpemFibGVzOiBwdWVkZXMgY2FtYmlhciBlbCBjb2xvciwgZWwgdGFtYcOxbywgbGEgZm9udGUgeSBtw6FzIG9wY2lvbmVzIGRlIGVzdGlsby4KCjAwOjAxOjMwLjAwMCAtLT4gMDA6MDI6MDAuMDAwRmluIGRlIGxhIGRlbW9zdHJhY2nDs24gZGUgbG9zIHN1YnTDrXR1bG9zIHBlcnNvbmFsaXphYmxlcy4gRXNwZXJhbW9zIHF1ZSB0ZSBoYXlhbiBzaWRvIMO6dGlsZXMu'
      },
      { kind: 'subtitles', srclang: 'en', label: 'English', src: 'data:text/vtt;base64,V0VCVlRUCgowMDowMDowMS4wMDAgLS0+IDAwOjAwOjEwLjAwMApUaGlzIGlzIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHZpZGVvIGluIEVuZ2xpc2guIEVuam95IHRoZSBkZW1vbnN0cmF0aW9uIG9mIGN1c3RvbWl6YWJsZSBzdWJ0aXRsZXMuCgowMDowMDoxMC4wMDAgLS0+IDAwOjAwOjIwLjAwMApUaGUgdmlkZW8gY29udGludWVzIGluIEVuZ2xpc2guIFlvdSBjYW4gbW9kaWZ5IHRoZSBhcHBlYXJhbmNlIG9mIHRoZSBzdWJ0aXRsZXMgdG8geW91ciBsaWtpbmcuCgowMDowMDoyMC4wMDAgLS0+IDAwOjAxOjMwLjAwMApDdXN0b21pemFibGUgc3VidGl0bGVzOiB5b3UgY2FuIGNoYW5nZSB0aGUgY29sb3IsIHNpemUsIGZvbnQsIGFuZCBvdGhlciBzdHlsZSBvcHRpb25zIGZvciBiZXR0ZXIgcmVhZGFiaWxpdHkuCgowMDowMTozMC4wMDAgLS0+IDAwOjAyOjAwLjAwMEVuZCBvZiB0aGUgY3VzdG9taXphYmxlIHN1YnRpdGxlcyBkZW1vbnN0cmF0aW9uLiBXZSBob3BlIHlvdSBmb3VuZCBpdCB1c2VmdWwu'
      }
    ]
  },
  {
    src: 'https://videos.pexels.com/video-files/9574131/9574131-uhd_2732_1440_25fps.mp4',
    tracks: [
      { kind: 'subtitles', srclang: 'es', label: 'Español', src: 'data:text/vtt;base64,V0VCVlRUCgowMDowMDowMS4wMDAgLS0+IDAwOjAwOjEwLjAwMApFc3RlIGVzIGVsIGNvbWllbnpvIGRlbCB2aWRlbyBlbiBlc3Bhw7FvbC4gRGlzZnJ1dGEgZGUgbGEgZGVtb3N0cmFjacOzbiBkZSBzdWJ0w610dWxvcyBwZXJzb25hbGl6YWJsZXMuCgowMDowMDoxMC4wMDAgLS0+IDAwOjAwOjIwLjAwMApDb250aW51YW1vcyBjb24gbcOhcyBjb250ZW5pZG8gZW4gZXNwYcOxb2wuIExvcyBzdWJ0w610dWxvcyBwdWVkZW4gc2VyIG1vZGlmaWNhZG9zIGVuIGFwYXJpZW5jaWEgeSBmb3JtYXRvLgoKMDA6MDA6MjAuMDAwIC0tPiAwMDowMTozMC4wMDAKU3VidMOtdHVsb3MgcGVyc29uYWxpemFibGVzOiBwdWVkZXMgY2FtYmlhciBlbCBjb2xvciwgZWwgdGFtYcOxbywgbGEgZm9udGUgeSBtw6FzIG9wY2lvbmVzIGRlIGVzdGlsby4KCjAwOjAxOjMwLjAwMCAtLT4gMDA6MDI6MDAuMDAwRmluIGRlIGxhIGRlbW9zdHJhY2nDs24gZGUgbG9zIHN1YnTDrXR1bG9zIHBlcnNvbmFsaXphYmxlcy4gRXNwZXJhbW9zIHF1ZSB0ZSBoYXlhbiBzaWRvIMO6dGlsZXMu'
      },
      { kind: 'subtitles', srclang: 'en', label: 'English', src: 'data:text/vtt;base64,V0VCVlRUCgowMDowMDowMS4wMDAgLS0+IDAwOjAwOjEwLjAwMApUaGlzIGlzIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHZpZGVvIGluIEVuZ2xpc2guIEVuam95IHRoZSBkZW1vbnN0cmF0aW9uIG9mIGN1c3RvbWl6YWJsZSBzdWJ0aXRsZXMuCgowMDowMDoxMC4wMDAgLS0+IDAwOjAwOjIwLjAwMApUaGUgdmlkZW8gY29udGludWVzIGluIEVuZ2xpc2guIFlvdSBjYW4gbW9kaWZ5IHRoZSBhcHBlYXJhbmNlIG9mIHRoZSBzdWJ0aXRsZXMgdG8geW91ciBsaWtpbmcuCgowMDowMDoyMC4wMDAgLS0+IDAwOjAxOjMwLjAwMApDdXN0b21pemFibGUgc3VidGl0bGVzOiB5b3UgY2FuIGNoYW5nZSB0aGUgY29sb3IsIHNpemUsIGZvbnQsIGFuZCBvdGhlciBzdHlsZSBvcHRpb25zIGZvciBiZXR0ZXIgcmVhZGFiaWxpdHkuCgowMDowMTozMC4wMDAgLS0+IDAwOjAyOjAwLjAwMEVuZCBvZiB0aGUgY3VzdG9taXphYmxlIHN1YnRpdGxlcyBkZW1vbnN0cmF0aW9uLiBXZSBob3BlIHlvdSBmb3VuZCBpdCB1c2VmdWwu'
      }
    ]
  }
];

// Estado para controles personalizados
const subtitleColor = ref(videos.map(() => '#FFFFFF'));
const subtitleBg = ref(videos.map(() => '#141428'));
const subtitleFont = ref(videos.map(() => "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"));
const subtitleSize = ref(videos.map(() => '20px'));
const subtitleLang = ref(videos.map(() => 'es'));
const playbackRate = ref(videos.map(() => 1));
const volume = ref(videos.map(() => 1));

function updateSubtitleStyle(idx) {
  // Crear o actualizar el estilo CSS para los subtítulos de cada video
  let style = document.getElementById('subtitleStyle'+idx);
  if (!style) {
    style = document.createElement('style');
    style.id = 'subtitleStyle'+idx;
    document.head.appendChild(style);
  }
  style.textContent = `
    video[data-idx='${idx}']::cue {
      color: ${subtitleColor.value[idx]} !important;
      background-color: ${subtitleBg.value[idx]} !important;
      font-family: ${subtitleFont.value[idx]} !important;
      font-size: ${subtitleSize.value[idx]} !important;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
    }
  `;
}

function changeSubtitleLanguage(idx, lang) {
  subtitleLang.value[idx] = lang;
  const video = videoRefs[idx];
  if (!video) return;
  const tracks = video.textTracks;
  for (let i = 0; i < tracks.length; i++) {
    tracks[i].mode = 'disabled';
    // srclang puede ser 'es' o 'en', language puede estar vacío
    if (lang !== 'off' && (tracks[i].language === lang || tracks[i].label.toLowerCase().includes(lang))) {
      tracks[i].mode = 'showing';
    }
  }
}

function changePlaybackRate(idx) {
  const video = videoRefs[idx];
  if (video) {
    video.playbackRate = Number(playbackRate.value[idx]);
  }
}

function changeVolume(idx) {
  const video = videoRefs[idx];
  if (video) {
    video.volume = Number(volume.value[idx]);
  }
}
const infoVisible = ref([false, false, false]);
const videoInfo = ref([null, null, null]);
const videoRefs = ref([]);

function toggleInfo(idx) {
  infoVisible.value[idx] = !infoVisible.value[idx];
  if (infoVisible.value[idx] && !videoInfo.value[idx]) {
    fetchVideoInfo(idx);
  }
}

function fetchVideoInfo(idx) {
  const url = videos[idx].src;
  const fileName = url.substring(url.lastIndexOf('/') + 1);
  const format = url.split('.').pop().toUpperCase();
  const xhr = new window.XMLHttpRequest();
  xhr.open('HEAD', url, true);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const fileSize = xhr.getResponseHeader('Content-Length');
      const sizeKB = (fileSize / 1024).toFixed(2);
      const sizeMB = (fileSize / (1024 * 1024)).toFixed(2);
      videoInfo.value[idx] = { fileName, format, sizeKB, sizeMB };
    } else {
      videoInfo.value[idx] = null;
    }
  };
  xhr.send();
}

onMounted(() => {
  nextTick(() => {
    $('.video-carousel').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
      arrows: true,
      dots: true,
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
          },
        },
      ],
    });
    // Pausar todos los videos y reproducir el actual
    $('.video-carousel').on('afterChange', function (event, slick, currentSlide) {
      $("video").each(function () {
        this.pause();
      });
      const videoEl = $(".slick-current video")[0];
      if (videoEl) videoEl.play();
      // Actualizar controles y subtítulos del video actual
      const idx = currentSlide;
      updateSubtitleStyle(idx);
      changeSubtitleLanguage(idx, subtitleLang.value[idx]);
      changePlaybackRate(idx);
      changeVolume(idx);
    });
    // Reproducir el primer video al cargar
    const firstVideo = $(".slick-current video")[0];
    if (firstVideo) firstVideo.play();
    updateSubtitleStyle(0);
    changeSubtitleLanguage(0, subtitleLang.value[0]);
    changePlaybackRate(0);
    changeVolume(0);
  });
});
</script>

<style scoped>
body {
  font-family: sans-serif;
  background-color: #2d3336;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  flex-direction: column;
}
.container {
  width: 80%;
  max-width: 900px;
}
.video-slide {
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
  background-color: #181d1f;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.video-slide video {
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin-bottom: 15px;
}
.info-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.info-button:hover {
  background-color: #0056b3;
}
.info-box {
  margin-top: 20px;
  padding: 15px;
  background-color: #171f28ff;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  text-align: left;
  display: block;
}
.info-box p {
  margin: 5px 0;
}
</style>
