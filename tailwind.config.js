/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
        'accent': 'var(--color-accent)',
        'background': 'var(--color-background)',
        'app-text': 'var(--color-text)', // Usar un nombre diferente para evitar conflicto
      },
      fontFamily: {
        'title': 'var(--font-title-family)',
        'subtitle': 'var(--font-subtitle-family)',
        'paragraph': 'var(--font-paragraph-family)',
      },
      fontSize: {
        'title': 'var(--font-title-size)',
        'subtitle': 'var(--font-subtitle-size)',
        'paragraph': 'var(--font-paragraph-size)',
      }
    },
  },
  plugins: [],
}