<template>
  <div class="h-screen flex flex-col" style="background:#fff !important;">
    <!-- Encabezado y pestañas -->
    <div class="flex-none px-4 pt-4" style="background:#fff !important;">
      <h1 class="text-3xl font-bold" style="color:#111 !important; background:#fff !important;">Personalización</h1>
      <div class="mt-4 border-b" style="background:#fff !important; border-color:#eee !important;">
        <div class="flex space-x-8" style="background:#fff !important;">
          <button @click="activeTab = 'colors'"
            :style="{ color: '#111', background: '#fff', borderBottom: activeTab === 'colors' ? '2px solid #111' : '2px solid transparent' }"
            class="pb-2 border-b-2 border-transparent transition-colors">
            Colores
          </button>
          <button @click="activeTab = 'typography'"
            :style="{ color: '#111', background: '#fff', borderBottom: activeTab === 'typography' ? '2px solid #111' : '2px solid transparent' }"
            class="pb-2 border-b-2 border-transparent transition-colors">
            Tipografía
          </button>
          <button @click="activeTab = 'saved'"
            :style="{ color: '#111', background: '#fff', borderBottom: activeTab === 'saved' ? '2px solid #111' : '2px solid transparent' }"
            class="pb-2 border-b-2 border-transparent transition-colors">
            Estilos Guardados
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 pb-4 overflow-hidden">
      <!-- Panel de controles -->
      <div class="overflow-y-auto pr-2 custom-scrollbar">
        <!-- Colores -->
        <div v-if="activeTab === 'colors'" class="bg-white rounded-lg shadow-lg">
          <div class="p-4">
            <h2 class="text-xl font-semibold text-primary">Controles de Color</h2>
          </div>
          <div class="p-4 space-y-4">
            <div v-for="(label, key, idx) in colorLabels" :key="key" class="control-group">
              <label class="block text-sm font-medium text-text mb-1">{{ label }}</label>
              <div class="flex items-center gap-4">
                <input type="color" v-model="colors[key]" class="w-16 h-10 rounded border border-text" />
                <span class="text-sm text-text">{{ colors[key] }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tipografía -->
        <div v-if="activeTab === 'typography'" class="bg-white rounded-lg shadow-lg">
          <div class="p-4">
            <h2 class="text-xl font-semibold text-primary">Controles de Tipografía</h2>
          </div>
          <!-- Subir Tipografía -->
          <div class="p-4 border-t border-text">
            <h3 class="text-lg font-medium text-primary mb-3">Subir Tipografía</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <input ref="fontFileInput" type="file" accept=".ttf" @change="onFontFileSelected" class="hidden" />
                <button @click="fontFileInput.click()"
                  class="bg-primary text-background px-4 py-2 rounded hover:bg-opacity-80">
                  Seleccionar Archivo TTF
                </button>
                <span v-if="selectedFontFile" class="text-sm text-text">
                  {{ selectedFontFile.name }}
                </span>
              </div>
              <div v-if="selectedFontFile" class="flex gap-2">
                <button @click="uploadFont" class="bg-secondary text-background px-4 py-2 rounded hover:bg-opacity-80">
                  Subir Tipografía
                </button>
                <button @click="cancelFontUpload"
                  class="bg-accent text-background px-4 py-2 rounded hover:bg-opacity-80">
                  Cancelar
                </button>
              </div>
              <div v-if="uploadedFonts.length > 0" class="mt-4">
                <h4 class="text-sm font-medium text-primary mb-2">Tipografías Subidas:</h4>
                <div class="space-y-2">
                  <div v-for="font in uploadedFonts" :key="font.name"
                    class="flex items-center justify-between p-2 bg-background rounded">
                    <span class="text-sm text-text">{{ font.name }}</span>
                    <button @click="deleteFont(font)" class="text-accent hover:text-opacity-80">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Título -->
          <div class="p-4 border-t border-text">
            <h3 class="text-lg font-medium text-primary mb-2">Título</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-text mb-1">Fuente</label>
                <select v-model="fonts.title.family"
                  class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary">
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option v-for="font in uploadedFonts" :key="font.name" :value="font.name">{{ font.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-text mb-1">Tamaño (px)</label>
                <div class="flex items-center gap-4">
                  <input type="range" v-model="fonts.title.size" min="24" max="48" step="1" class="flex-1" />
                  <span class="text-sm text-text w-16">{{ fonts.title.size }}px</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Subtítulo -->
          <div class="p-4 border-t border-text">
            <h3 class="text-lg font-medium text-primary mb-2">Subtítulo</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-text mb-1">Fuente</label>
                <select v-model="fonts.subtitle.family"
                  class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary">
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option v-for="font in uploadedFonts" :key="font.name" :value="font.name">{{ font.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-text mb-1">Tamaño (px)</label>
                <div class="flex items-center gap-4">
                  <input type="range" v-model="fonts.subtitle.size" min="18" max="32" step="1" class="flex-1" />
                  <span class="text-sm text-text w-16">{{ fonts.subtitle.size }}px</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Texto -->
          <div class="p-4 border-t border-text">
            <h3 class="text-lg font-medium text-primary mb-2">Texto</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-text mb-1">Fuente</label>
                <select v-model="fonts.body.family"
                  class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary">
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option v-for="font in uploadedFonts" :key="font.name" :value="font.name">{{ font.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-text mb-1">Tamaño (px)</label>
                <div class="flex items-center gap-4">
                  <input type="range" v-model="fonts.body.size" min="12" max="20" step="1" class="flex-1" />
                  <span class="text-sm text-text w-16">{{ fonts.body.size }}px</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estilos Guardados -->
        <div v-if="activeTab === 'saved'" class="bg-white rounded-lg shadow-lg">
          <div class="p-4">
            <h2 class="text-xl font-semibold text-primary">Estilos Guardados</h2>
          </div>
          <div class="p-4 space-y-4">
            <!-- Formulario para guardar estilo -->
            <div class="border border-text rounded-lg p-4">
              <h3 class="text-lg font-medium text-primary mb-3">Guardar Estilo Actual</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-text mb-1">Nombre del Estilo</label>
                  <input type="text" v-model="newStyleName"
                    class="w-full px-3 py-2 border border-text rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="Ej: Tema Oscuro">
                </div>
                <button @click="saveStyle"
                  class="w-full bg-primary text-background px-4 py-2 rounded hover:bg-opacity-80">
                  Guardar Estilo
                </button>
              </div>
            </div>
            <!-- Lista de estilos guardados -->
            <div class="space-y-3">
              <h3 class="text-lg font-medium text-primary">Estilos Guardados</h3>
              <div v-if="savedStyles.length === 0" class="text-text text-center py-4">
                No hay estilos guardados
              </div>
              <div v-for="style in savedStyles" :key="style.name" class="border border-text rounded-lg p-4 space-y-3">
                <div class="flex justify-between items-center">
                  <h4 class="font-medium text-primary">{{ style.name }}</h4>
                  <div class="flex gap-2">
                    <button @click="applyStyle(style)"
                      class="px-3 py-1 bg-secondary text-background rounded hover:bg-opacity-80 text-sm">
                      Aplicar
                    </button>
                    <button @click="deleteStyle(style)"
                      class="px-3 py-1 bg-accent text-background rounded hover:bg-opacity-80 text-sm">
                      Eliminar
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-5 gap-2">
                  <div class="h-8 rounded" :style="{ backgroundColor: style.colors.primary }"></div>
                  <div class="h-8 rounded" :style="{ backgroundColor: style.colors.secondary }"></div>
                  <div class="h-8 rounded" :style="{ backgroundColor: style.colors.accent }"></div>
                  <div class="h-8 rounded" :style="{ backgroundColor: style.colors.background }"></div>
                  <div class="h-8 rounded" :style="{ backgroundColor: style.colors.text }"></div>
                </div>
                <div class="text-sm text-text">
                  <div>Fuente Principal: {{ style.fonts.title.family }}</div>
                  <div>Tamaño Base: {{ style.fonts.body.size }}px</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel de vista previa -->
      <div :style="{ backgroundColor: colors.background }" class="rounded-lg p-4 overflow-y-auto">
        <div :style="{
          '--color-primary': colors.primary,
          '--color-secondary': colors.secondary,
          '--color-accent': colors.accent,
          '--color-background': colors.background,
          '--color-text': colors.text,
          '--font-title-family': fonts.title.family,
          '--font-title-size': fonts.title.size + 'px',
          '--font-title-weight': fonts.title.weight,
          '--font-subtitle-family': fonts.subtitle.family,
          '--font-subtitle-size': fonts.subtitle.size + 'px',
          '--font-subtitle-weight': fonts.subtitle.weight,
          '--font-body-family': fonts.body.family,
          '--font-body-size': fonts.body.size + 'px',
          '--font-body-weight': fonts.body.weight
        }" class="preview-content">
          <!-- Tipografía -->
          <div class="mb-6">
            <h3 :style="{ color: colors.primary }" class="text-lg font-medium mb-3">Tipografía</h3>
            <div class="space-y-4">
              <div>
                <h1 :style="{
                  fontFamily: fonts.title.family,
                  fontSize: fonts.title.size + 'px',
                  fontWeight: fonts.title.weight,
                  color: colors.primary
                }">
                  Título Principal
                </h1>
                <p :style="{ color: colors.text }" class="text-sm mt-1">
                  Fuente: {{ fonts.title.family }} | Tamaño: {{ fonts.title.size }}px | Peso: {{ fonts.title.weight }}
                </p>
              </div>
              <div>
                <h2 :style="{
                  fontFamily: fonts.subtitle.family,
                  fontSize: fonts.subtitle.size + 'px',
                  fontWeight: fonts.subtitle.weight,
                  color: colors.primary
                }">
                  Subtítulo
                </h2>
                <p :style="{ color: colors.text }" class="text-sm mt-1">
                  Fuente: {{ fonts.subtitle.family }} | Tamaño: {{ fonts.subtitle.size }}px | Peso: {{
                    fonts.subtitle.weight }}
                </p>
              </div>
              <div>
                <p :style="{
                  fontFamily: fonts.body.family,
                  fontSize: fonts.body.size + 'px',
                  fontWeight: fonts.body.weight,
                  color: colors.text
                }">
                  Este es un párrafo de texto normal. Aquí puedes ver cómo se ve el texto con la fuente, tamaño y peso
                  seleccionados.
                </p>
                <p :style="{ color: colors.text }" class="text-sm mt-1">
                  Fuente: {{ fonts.body.family }} | Tamaño: {{ fonts.body.size }}px | Peso: {{ fonts.body.weight }}
                </p>
              </div>
            </div>
          </div>
          <!-- Componentes: Navbar, Botones, Formulario, Tarjetas -->
          <!-- ... (puedes copiar la estructura de tu preview aquí, igual que en Angular) ... -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'

interface SavedStyle {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    title: { family: string; size: string | number; weight: string }
    subtitle: { family: string; size: string | number; weight: string }
    body: { family: string; size: string | number; weight: string }
  }
}

const activeTab = ref<'colors' | 'typography' | 'saved'>('colors')
const newStyleName = ref('')
const savedStyles = ref<SavedStyle[]>([])
const selectedFontFile = ref<File | null>(null)
const uploadedFonts = ref<{ name: string; url: string }[]>([])

const colors = reactive({
  primary: '#2C3E50',
  secondary: '#3498DB',
  accent: '#E74C3C',
  background: '#ECF0F1',
  text: '#95A5A6'
})

const fonts = reactive({
  title: { family: 'Inter', size: 36, weight: '700' },
  subtitle: { family: 'Inter', size: 24, weight: '600' },
  body: { family: 'Inter', size: 16, weight: '400' }
})

const colorLabels = {
  primary: 'Color 1',
  secondary: 'Color 2',
  accent: 'Color 3',
  background: 'Color 4',
  text: 'Color 5'
}

const fontFileInput = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  await loadSavedStyles()
  await loadUploadedFonts()
  // Si quieres mantener la lógica de recarga, puedes hacerlo aquí
  // const res = await fetch('/styles/default', { method: 'GET' })
  // const data = await res.json()
  // if (data.success) window.location.reload()
})

async function loadUploadedFonts() {
  try {
    const res = await fetch('/styles/fonts')
    const data = await res.json()
    if (res.ok && Array.isArray(data)) {
      uploadedFonts.value = data.map((font: string) => ({
        name: font,
        url: `fonts/${font}`
      }))
    } else {
      uploadedFonts.value = []
    }
  } catch {
    uploadedFonts.value = []
  }
}

async function loadSavedStyles() {
  try {
    const res = await fetch('/styles/index')
    const data = await res.json()
    if (res.ok && Array.isArray(data)) {
      savedStyles.value = data.map((style: any) => ({
        name: style.name,
        colors: {
          primary: style.primary,
          secondary: style.secondary,
          accent: style.accent,
          background: style.background,
          text: style.text
        },
        fonts: {
          title: {
            family: style.familyTitle,
            size: style.sizeTitle,
            weight: style.weightTitle
          },
          subtitle: {
            family: style.familySubtitle,
            size: style.sizeSubtitle,
            weight: style.weightSubtitle
          },
          body: {
            family: style.familyBody,
            size: style.sizeBody,
            weight: style.weightBody
          }
        }
      }))
    } else {
      savedStyles.value = []
    }
  } catch {
    savedStyles.value = []
  }
}

async function applyStyle(style: SavedStyle) {
  Object.assign(colors, style.colors)
  Object.assign(fonts.title, style.fonts.title)
  Object.assign(fonts.subtitle, style.fonts.subtitle)
  Object.assign(fonts.body, style.fonts.body)
  try {
    const res = await fetch('/styles/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: style.name })
    })
    const data = await res.json()
    if (!res.ok) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.error?.error || data.error || 'No se pudo marcar el estilo como seleccionado.',
        confirmButtonColor: '#e11d48'
      })
      return
    }
  } catch {
    await Swal.fire({
      icon: 'error',
      title: 'Error de red',
      text: 'No se pudo conectar con el servidor.',
      confirmButtonColor: '#e11d48'
    })
    return
  }
  await Swal.fire({
    icon: 'success',
    title: 'Estilo Aplicado',
    text: `El estilo "${style.name}" ha sido aplicado correctamente.`,
    confirmButtonColor: '#6366f1'
  })
  window.location.href = '/'
}

async function saveStyle() {
  if (!newStyleName.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Nombre requerido',
      text: 'Por favor, ingresa un nombre para el estilo.',
      confirmButtonColor: '#6366f1'
    })
    return
  }
  const style = {
    name: newStyleName.value,
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    background: colors.background,
    text: colors.text,
    familyTitle: fonts.title.family,
    sizeTitle: fonts.title.size,
    weightTitle: fonts.title.weight,
    familySubtitle: fonts.subtitle.family,
    sizeSubtitle: fonts.subtitle.size,
    weightSubtitle: fonts.subtitle.weight,
    familyBody: fonts.body.family,
    sizeBody: fonts.body.size,
    weightBody: fonts.body.weight
  }
  try {
    const res = await fetch('/styles/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(style)
    })
    const data = await res.json()
    if (!res.ok) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.error?.error || data.error || 'No se pudo guardar el estilo.',
        confirmButtonColor: '#e11d48'
      })
      return
    }
    await Swal.fire({
      icon: 'success',
      title: 'Estilo guardado',
      text: 'El estilo se guardó correctamente en la base de datos.',
      confirmButtonColor: '#6366f1'
    })
    newStyleName.value = ''
    await loadSavedStyles()
  } catch {
    await Swal.fire({
      icon: 'error',
      title: 'Error de red',
      text: 'No se pudo conectar con el servidor.',
      confirmButtonColor: '#e11d48'
    })
  }
}

async function deleteStyle(style: SavedStyle) {
  const result = await Swal.fire({
    title: '¿Eliminar estilo?',
    text: '¿Estás seguro de que deseas eliminar este estilo?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#6366f1'
  })
  if (!result.isConfirmed) return
  try {
    const res = await fetch('/styles/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: style.name })
    })
    const data = await res.json()
    if (!res.ok) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.error?.error || data.error || 'No se pudo eliminar el estilo.',
        confirmButtonColor: '#e11d48'
      })
      return
    }
    savedStyles.value = savedStyles.value.filter(s => s.name !== style.name)
    await Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: 'El estilo ha sido eliminado.',
      confirmButtonColor: '#6366f1'
    })
  } catch {
    await Swal.fire({
      icon: 'error',
      title: 'Error de red',
      text: 'No se pudo conectar con el servidor.',
      confirmButtonColor: '#e11d48'
    })
  }
}

function onFontFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    if (file.type === 'font/ttf' || file.name.endsWith('.ttf')) {
      selectedFontFile.value = file
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Archivo inválido',
        text: 'Por favor, selecciona un archivo TTF válido.',
        confirmButtonColor: '#e11d48'
      })
      input.value = ''
    }
  }
}

async function uploadFont() {
  if (!selectedFontFile.value) return
  const formData = new FormData()
  formData.append('file', selectedFontFile.value)
  try {
    const res = await fetch('/styles/upload-font', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (!res.ok) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.error || 'No se pudo subir la fuente.',
        confirmButtonColor: '#e11d48'
      })
      return
    }
    uploadedFonts.value.push({
      name: data.file.name,
      url: data.file.path
    })
    await Swal.fire({
      icon: 'success',
      title: 'Fuente subida',
      text: 'La fuente se subió correctamente.',
      confirmButtonColor: '#6366f1'
    })
    window.location.reload()
  } catch {
    await Swal.fire({
      icon: 'error',
      title: 'Error de red',
      text: 'No se pudo conectar con el servidor.',
      confirmButtonColor: '#e11d48'
    })
  }
  selectedFontFile.value = null
}

function cancelFontUpload() {
  selectedFontFile.value = null
}

async function deleteFont(font: { name: string; url: string }) {
  const result = await Swal.fire({
    title: '¿Eliminar fuente?',
    text: `¿Estás seguro de que deseas eliminar la fuente "${font.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#6366f1'
  })
  if (!result.isConfirmed) return
  try {
    const res = await fetch('/styles/delete-font', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fontName: font.name })
    })
    const data = await res.json()
    if (!res.ok) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.error || 'No se pudo eliminar la fuente.',
        confirmButtonColor: '#e11d48'
      })
      return
    }
    uploadedFonts.value = uploadedFonts.value.filter(f => f.name !== font.name)
    await Swal.fire({
      icon: 'success',
      title: 'Fuente eliminada',
      text: 'La fuente ha sido eliminada correctamente.',
      confirmButtonColor: '#6366f1'
    })
  } catch {
    await Swal.fire({
      icon: 'error',
      title: 'Error de red',
      text: 'No se pudo conectar con el servidor.',
      confirmButtonColor: '#e11d48'
    })
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>