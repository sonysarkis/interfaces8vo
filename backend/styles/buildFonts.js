import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function buildFonts() {
  // Obtener __dirname en ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Ruta al directorio donde están los archivos CSS y fuentes
  const browserDir = path.resolve(__dirname, '../../dist/application/browser');
  const fontsDir = path.join(browserDir, 'fonts');

  // Buscar el archivo que comienza con "style" y termina en ".css"
  const files = fs.existsSync(browserDir) ? fs.readdirSync(browserDir) : [];
  const cssFile = files.find(f => /^style.*\.css$/.test(f));

  if (!cssFile) {
    console.error('No se encontró un archivo CSS que comience con "style"');
    process.exit(1);
  }

  const cssPath = path.join(browserDir, cssFile);

  // Lee todos los archivos .ttf en la carpeta de fuentes
  const fontFiles = fs.existsSync(fontsDir)
    ? fs.readdirSync(fontsDir).filter(file => file.endsWith('.ttf'))
    : [];

  let fontFaces = '';

  for (const file of fontFiles) {
    // El nombre de la fuente será el nombre del archivo sin extensión
    const fontName = path.basename(file, '.ttf');
    fontFaces += `
        @font-face {
        font-family: '${fontName}';
        src: url('fonts/${file}') format('truetype');
        font-weight: normal;
        font-style: normal;
        }
    `;
  }

  // Lee el contenido actual del CSS (si existe)
  let cssContent = '';
  if (fs.existsSync(cssPath)) {
    cssContent = fs.readFileSync(cssPath, 'utf8');
    // Elimina bloques @font-face generados anteriormente (opcional, si quieres limpiar)
    cssContent = cssContent.replace(/\/\* FONTS AUTO-GENERATED START \*\/[\s\S]*?\/\* FONTS AUTO-GENERATED END \*\//, '');
  }

  // Inserta los nuevos @font-face al inicio del archivo CSS
  const newCss =
    `/* FONTS AUTO-GENERATED START */\n${fontFaces}/* FONTS AUTO-GENERATED END */\n` +
    cssContent.trim();

  fs.writeFileSync(cssPath, newCss, 'utf8');
  console.log('Font faces generados en', cssFile);
}