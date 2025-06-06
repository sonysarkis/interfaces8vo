export interface StylePreset {
    id: string;
    name: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      title: { family: string; size: string; color: string; };
      subtitle: { family: string; size: string; color: string; };
      paragraph: { family: string; size: string; color: string; };
    };
  }