import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="carousel">
      <div class="carousel-container">
        <div class="carousel-slides">
          <div class="slide" *ngFor="let slide of slides; let i = index" 
               [class.active]="i === currentSlide">
            <img [src]="slide.image" [alt]="slide.title">
            <div class="slide-content">
              <h2>{{ slide.title }}</h2>
              <p>{{ slide.description }}</p>
            </div>
          </div>
        </div>
        
        <button class="carousel-control prev" (click)="prevSlide()">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="carousel-control next" (click)="nextSlide()">
          <i class="fas fa-chevron-right"></i>
        </button>
        
        <div class="carousel-indicators">
          <button *ngFor="let slide of slides; let i = index"
                  [class.active]="i === currentSlide"
                  (click)="goToSlide(i)">
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
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
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      color: white;
    }

    .slide-content h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .carousel-control {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.5);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .carousel-control:hover {
      background: rgba(255, 255, 255, 0.8);
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
      border: none;
      background: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .carousel-indicators button.active {
      background: white;
    }
  `]
})
export class CarouselComponent implements OnInit, OnDestroy {
  slides = [
    {
      image: 'assets/images/atencion-cliente.png',
      title: 'Atención al Cliente',
      description: 'Resolvemos tus dudas y problemas 24/7 para que nunca te detengas.'
    },
    {
      image: 'assets/images/innovacion.png',
      title: 'Innovación Constante',
      description: 'Siempre implementamos las últimas tecnologías para tu empresa.'
    },
    {
      image: 'assets/images/equipo.png',
      title: 'Trabajo en Equipo',
      description: 'Nuestro equipo multidisciplinario impulsa el éxito de tu proyecto.'
    },
    {
      image: 'assets/images/crecimiento.png',
      title: 'Crecimiento Asegurado',
      description: 'Te ayudamos a escalar tu negocio y alcanzar nuevos mercados.'
    },
    {
      image: 'assets/images/seguridad.png',
      title: 'Seguridad y Confianza',
      description: 'Protegemos tus datos y operaciones con los más altos estándares.'
    }
  ];

  currentSlide = 0;
  private interval: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  private startAutoSlide() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  private stopAutoSlide() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
} 