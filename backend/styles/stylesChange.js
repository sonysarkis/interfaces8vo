import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { StylesModel } from './stylesModel.js';

export async function changeStyle() {
  // Obtener __dirname en ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Ruta al directorio donde están los archivos CSS
  const cssDir = path.resolve(__dirname, '../../dist/application/browser');

  // Buscar el archivo que comienza con "styles" y termina en ".css"
  const files = fs.readdirSync(cssDir);
  const cssFile = files.find(f => /^styles.*\.css$/.test(f));

  if (!cssFile) {
    console.error('No se encontró un archivo CSS que comience con "styles"');
    return;
  }

  const cssPath = path.join(cssDir, cssFile);
  let cssContent = fs.readFileSync(cssPath, 'utf-8');

  // Obtener el style seleccionado desde la base de datos
  let selectedStyle;
  try {
    selectedStyle = await StylesModel.getSelected();
  } catch (error) {
    console.error('No se pudo obtener el estilo seleccionado:', error.message);
    return;
  }

  // Construir el nuevo bloque de variables CSS
  const newVars = `
    --primary-color: ${selectedStyle.primary};
    --color-primary: ${selectedStyle.primary};
    --secondary-color: ${selectedStyle.secondary};
    --color-secondary: ${selectedStyle.secondary};
    --accent-color: ${selectedStyle.accent};
    --color-accent: ${selectedStyle.accent};
    --background-color: ${selectedStyle.background};
    --color-background: ${selectedStyle.background};
    --text-color: ${selectedStyle.text};
    --color-text: ${selectedStyle.text};

    --color-primary-light: ${selectedStyle.primary};
    --color-primary-dark: ${selectedStyle.primary};
    --color-secondary-light: ${selectedStyle.secondary};
    --color-secondary-dark: ${selectedStyle.secondary};
    --color-accent-light: ${selectedStyle.accent};
    --color-accent-dark: ${selectedStyle.accent};
    --color-background-dark: ${selectedStyle.background};
    --color-text-dark: ${selectedStyle.text};

    /* Fuentes */
    --font-title-family: ${selectedStyle.familyTitle};
    --font-title-size: ${selectedStyle.sizeTitle}px;
    --font-title-color: var(--text-color);

    --font-subtitle-family: ${selectedStyle.familySubtitle};
    --font-subtitle-size: ${selectedStyle.sizeSubtitle}px;
    --font-subtitle-color: var(--text-color);

    --font-paragraph-family: ${selectedStyle.familyBody};
    --font-paragraph-size: ${selectedStyle.sizeBody}px;
    --font-paragraph-color: var(--text-color);
  `;

  // Valores por defecto
  const defaultVars = {
    '--primary-color': selectedStyle.primary,
    '--color-primary': selectedStyle.primary,
    '--secondary-color': selectedStyle.secondary,
    '--color-secondary': selectedStyle.secondary,
    '--accent-color': selectedStyle.accent,
    '--color-accent': selectedStyle.accent,
    '--background-color': selectedStyle.background,
    '--color-background': selectedStyle.background,
    '--text-color': selectedStyle.text,
    '--color-text': selectedStyle.text,
    '--color-primary-light': selectedStyle.primary,
    '--color-primary-dark': selectedStyle.primary,
    '--color-secondary-light': selectedStyle.secondary,
    '--color-secondary-dark': selectedStyle.secondary,
    '--color-accent-light': selectedStyle.accent,
    '--color-accent-dark': selectedStyle.accent,
    '--color-background-dark': selectedStyle.background,
    '--color-text-dark': selectedStyle.text,
    '--font-title-family': selectedStyle.familyTitle,
    '--font-title-size': `${selectedStyle.sizeTitle}px`,
    '--font-title-color': `var(--text-color)`,
    '--font-subtitle-family': selectedStyle.familySubtitle,
    '--font-subtitle-size': `${selectedStyle.sizeSubtitle}px`,
    '--font-subtitle-color': `var(--text-color)`,
    '--font-paragraph-family': selectedStyle.familyBody,
    '--font-paragraph-size': `${selectedStyle.sizeBody}px`,
    '--font-paragraph-color': `var(--text-color)`
  };

  // Extrae el bloque :root {...} del CSS
  const rootMatch = cssContent.match(/:root\s*{([^}]*)}/m);
  if (rootMatch) {
    const varsBlock = rootMatch[1];
    let allDefaults = true;
    for (const [key, value] of Object.entries(defaultVars)) {
      const regex = new RegExp(`${key}\\s*:\\s*${value.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')}`, 'i');
      if (!regex.test(varsBlock)) {
        allDefaults = false;
        break;
      }
    }
    if (allDefaults) {
      // Ya están los valores por defecto
      return false;
    }
  }

  // Reemplazar el bloque de variables en :root
  cssContent = cssContent.replace(
    /(:root\s*{)[^}]*}/m,
    `$1${newVars}\n}`
  );

  // Escribir el archivo actualizado
  fs.writeFileSync(cssPath, cssContent, 'utf-8');
  console.log('Variables CSS actualizadas con el estilo seleccionado.');
  return true;
}

export function resetStyle() {
  // Obtener __dirname en ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Ruta al directorio donde están los archivos CSS
  const cssDir = path.resolve(__dirname, '../../dist/application/browser');

  // Buscar el archivo que comienza con "styles" y termina en ".css"
  const files = fs.readdirSync(cssDir);
  const cssFile = files.find(f => /^styles.*\.css$/.test(f));

  if (!cssFile) {
    console.error('No se encontró un archivo CSS que comience con "styles"');
    return;
  }

  const cssPath = path.join(cssDir, cssFile);
  let cssContent = fs.readFileSync(cssPath, 'utf-8');

  // Valores por defecto
  const defaultVars = {
    '--primary-color': '#2C3E50',
    '--color-primary': '#2C3E50',
    '--secondary-color': '#3498DB',
    '--color-secondary': '#3498DB',
    '--accent-color': '#E74C3C',
    '--color-accent': '#E74C3C',
    '--background-color': '#ECF0F1',
    '--color-background': '#ECF0F1',
    '--text-color': '#95A5A6',
    '--color-text': '#95A5A6',
    '--font-title-family': "'Arial', sans-serif",
    '--font-title-size': '2.5rem',
    '--font-subtitle-family': "'Arial', sans-serif",
    '--font-subtitle-size': '1.8rem',
    '--font-paragraph-family': "'Arial', sans-serif",
    '--font-paragraph-size': '1rem'
  };

  // Extrae el bloque :root {...} del CSS
  const rootMatch = cssContent.match(/:root\s*{([^}]*)}/m);
  if (rootMatch) {
    const varsBlock = rootMatch[1];
    let allDefaults = true;
    for (const [key, value] of Object.entries(defaultVars)) {
      const regex = new RegExp(`${key}\\s*:\\s*${value.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')}`, 'i');
      if (!regex.test(varsBlock)) {
        allDefaults = false;
        break;
      }
    }
    if (allDefaults) {
      // Ya están los valores por defecto
      return false;
    }
  }

  // Construir el nuevo bloque de variables CSS
  const newVars = `
    --primary-color: #2C3E50;
    --color-primary: #2C3E50;
    --secondary-color: #3498DB;
    --color-secondary: #3498DB;
    --accent-color: #E74C3C;
    --color-accent: #E74C3C;
    --background-color: #ECF0F1;
    --color-background: #ECF0F1;
    --text-color: #95A5A6;
    --color-text: #95A5A6;

    --color-primary-light: #2C3E50;
    --color-primary-dark: #2C3E50;
    --color-secondary-light: #3498DB;
    --color-secondary-dark: #3498DB;
    --color-accent-light: #E74C3C;
    --color-accent-dark: #E74C3C;
    --color-background-dark: #ECF0F1;
    --color-text-dark: #95A5A6;

    /* Fuentes */
    --font-title-family: 'Arial', sans-serif;
    --font-title-size: 2.5rem;
    --font-title-color: var(--text-color);

    --font-subtitle-family: 'Arial', sans-serif;
    --font-subtitle-size: 1.8rem;
    --font-subtitle-color: var(--text-color);

    --font-paragraph-family: 'Arial', sans-serif;
    --font-paragraph-size: 1rem;
    --font-paragraph-color: var(--text-color);
  `;

  // Reemplazar el bloque de variables en :root
  cssContent = cssContent.replace(
    /(:root\s*{)[^}]*}/m,
    `$1${newVars}\n}`
  );

  // Escribir el archivo actualizado
  fs.writeFileSync(cssPath, cssContent, 'utf-8');
  console.log('Variables CSS actualizadas con el estilo por defecto.');
  return true;
}