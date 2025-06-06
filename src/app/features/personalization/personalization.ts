import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

interface FontStyles {
  family: string;
  size: number;
  color: string;
}

interface ColorStyles {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface Styles {
  fonts: {
    title: FontStyles;
    subtitle: FontStyles;
    paragraph: FontStyles;
  };
  colors: ColorStyles;
}

@Component({
  selector: 'app-personalization',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './personalization.html',
  styleUrl: './personalization.scss'
})
export class Personalization implements OnInit {
  currentStyles$ = new BehaviorSubject<Styles>({
    fonts: {
      title: { family: 'Arial', size: 24, color: '#000000' },
      subtitle: { family: 'Arial', size: 18, color: '#333333' },
      paragraph: { family: 'Arial', size: 14, color: '#666666' }
    },
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745',
      background: '#ffffff',
      text: '#212529'
    }
  });

  titleFontSize = 24;
  subtitleFontSize = 18;
  paragraphFontSize = 14;

  constructor() { }

  ngOnInit() { }

  updateStyles() {
    // Implementar lógica para actualizar estilos
    this.currentStyles$.next(this.currentStyles$.value);
  }

  updateFontStyles(type: 'title' | 'subtitle' | 'paragraph') {
    const styles = this.currentStyles$.value;
    switch (type) {
      case 'title':
        styles.fonts.title.size = this.titleFontSize;
        break;
      case 'subtitle':
        styles.fonts.subtitle.size = this.subtitleFontSize;
        break;
      case 'paragraph':
        styles.fonts.paragraph.size = this.paragraphFontSize;
        break;
    }
    this.updateStyles();
  }

  uploadFont(event: Event, type: 'title' | 'subtitle' | 'paragraph') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Implementar lógica para cargar fuente
      console.log(`Uploading font for ${type}:`, file);
    }
  }

  saveCurrentStyles() {
    // Implementar lógica para guardar estilos
    console.log('Saving current styles:', this.currentStyles$.value);
  }

  resetToDefault() {
    this.currentStyles$.next({
      fonts: {
        title: { family: 'Arial', size: 24, color: '#000000' },
        subtitle: { family: 'Arial', size: 18, color: '#333333' },
        paragraph: { family: 'Arial', size: 14, color: '#666666' }
      },
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        accent: '#28a745',
        background: '#ffffff',
        text: '#212529'
      }
    });
  }

  loadPreset(id: string) {
    // Implementar lógica para cargar preset
    console.log('Loading preset:', id);
  }

  deletePreset(id: string) {
    // Implementar lógica para eliminar preset
    console.log('Deleting preset:', id);
  }
}
