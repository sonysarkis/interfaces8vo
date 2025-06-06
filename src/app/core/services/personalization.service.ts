import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface StylePreset {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    title: {
      family: string;
      size: string;
      color: string;
    };
    subtitle: {
      family: string;
      size: string;
      color: string;
    };
    paragraph: {
      family: string;
      size: string;
      color: string;
    };
  };
}

const defaultStyles: StylePreset = {
  colors: {
    primary: '#4f46e5',
    secondary: '#6366f1',
    accent: '#818cf8',
    background: '#ffffff',
    text: '#1f2937'
  },
  fonts: {
    title: {
      family: 'Inter',
      size: '24px',
      color: '#1f2937'
    },
    subtitle: {
      family: 'Roboto',
      size: '18px',
      color: '#1f2937'
    },
    paragraph: {
      family: 'Inter',
      size: '14px',
      color: '#1f2937'
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class PersonalizationService {
  private currentStyles = new BehaviorSubject<StylePreset>(defaultStyles);
  private savedStyles = new BehaviorSubject<StylePreset>(defaultStyles);

  currentStyles$ = this.currentStyles.asObservable();
  savedStyles$ = this.savedStyles.asObservable();

  constructor() {
    // Cargar estilos guardados del localStorage si existen
    const savedStyles = localStorage.getItem('savedStyles');
    if (savedStyles) {
      this.savedStyles.next(JSON.parse(savedStyles));
      this.currentStyles.next(JSON.parse(savedStyles));
    }
  }

  updateColor(type: string, value: string) {
    const currentStyles = this.currentStyles.value;
    this.currentStyles.next({
      ...currentStyles,
      colors: {
        ...currentStyles.colors,
        [type]: value
      }
    });
  }

  updateFont(type: string, value: string) {
    const currentStyles = this.currentStyles.value;
    this.currentStyles.next({
      ...currentStyles,
      fonts: {
        ...currentStyles.fonts,
        [type]: {
          ...currentStyles.fonts[type as keyof typeof currentStyles.fonts],
          family: value
        }
      }
    });
  }

  updateSize(type: string, value: number) {
    const currentStyles = this.currentStyles.value;
    this.currentStyles.next({
      ...currentStyles,
      fonts: {
        ...currentStyles.fonts,
        [type]: {
          ...currentStyles.fonts[type as keyof typeof currentStyles.fonts],
          size: `${value}px`
        }
      }
    });
  }

  applyPreset(styles: StylePreset) {
    this.currentStyles.next(styles);
  }

  saveChanges() {
    const currentStyles = this.currentStyles.value;
    this.savedStyles.next(currentStyles);
    localStorage.setItem('savedStyles', JSON.stringify(currentStyles));
  }

  resetChanges() {
    this.currentStyles.next(this.savedStyles.value);
  }

  getCurrentStyles(): Observable<StylePreset> {
    return this.currentStyles$;
  }

  getSavedStyles(): Observable<StylePreset> {
    return this.savedStyles$;
  }
}