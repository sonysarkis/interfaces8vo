

import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import Tangram from '../tangram/tangram.tsx';

interface SavedStyle {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    title: { family: string; size: string | number; weight: string };
    subtitle: { family: string; size: string | number; weight: string };
    body: { family: string; size: string | number; weight: string };
  };
}

const colorLabels: Record<string, string> = {
  primary: 'Color 1',
  secondary: 'Color 2',
  accent: 'Color 3',
  background: 'Color 4',
  text: 'Color 5',
};

const defaultColors = {
  primary: '#2C3E50',
  secondary: '#3498DB',
  accent: '#E74C3C',
  background: '#ECF0F1',
  text: '#95A5A6',
};

const defaultFonts = {
  title: { family: 'Inter', size: 36, weight: '700' },
  subtitle: { family: 'Inter', size: 24, weight: '600' },
  body: { family: 'Inter', size: 16, weight: '400' },
};

const Personalization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'saved'>('colors');
  const [newStyleName, setNewStyleName] = useState('');
  const [savedStyles, setSavedStyles] = useState<SavedStyle[]>([]);
  const [selectedFontFile, setSelectedFontFile] = useState<File | null>(null);
  const [uploadedFonts, setUploadedFonts] = useState<{ name: string; url: string }[]>([]);
  const [colors, setColors] = useState({ ...defaultColors });
  const [fonts, setFonts] = useState({ ...defaultFonts });
  const fontFileInput = useRef<HTMLInputElement | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const loaderSetting = localStorage.getItem('showTangramLoader');
    if (loaderSetting === null || loaderSetting === 'true') {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, []);

  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShowLoader(false), 1000);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  useEffect(() => {
    loadSavedStyles();
    loadUploadedFonts();
    // Si quieres mantener la lógica de recarga, puedes hacerlo aquí
    fetch('/styles/default', { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        if (data.success) window.location.reload();
      });
    // eslint-disable-next-line
  }, []);

  async function loadUploadedFonts() {
    try {
      const res = await fetch('/styles/fonts');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setUploadedFonts(data.map((font: string) => ({ name: font, url: `fonts/${font}` })));
      } else {
        setUploadedFonts([]);
      }
    } catch {
      setUploadedFonts([]);
    }
  }

  async function loadSavedStyles() {
    try {
      const res = await fetch('/styles/index');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setSavedStyles(
          data.map((style: any) => ({
            name: style.name,
            colors: {
              primary: style.primary,
              secondary: style.secondary,
              accent: style.accent,
              background: style.background,
              text: style.text,
            },
            fonts: {
              title: {
                family: style.familyTitle,
                size: style.sizeTitle,
                weight: style.weightTitle,
              },
              subtitle: {
                family: style.familySubtitle,
                size: style.sizeSubtitle,
                weight: style.weightSubtitle,
              },
              body: {
                family: style.familyBody,
                size: style.sizeBody,
                weight: style.weightBody,
              },
            },
          }))
        );
      } else {
        setSavedStyles([]);
      }
    } catch {
      setSavedStyles([]);
    }
  }

  async function applyStyle(style: SavedStyle) {
    setColors({ ...style.colors });
    setFonts({
      title: {
        ...style.fonts.title,
        size: typeof style.fonts.title.size === 'string' ? Number(style.fonts.title.size) : style.fonts.title.size,
      },
      subtitle: {
        ...style.fonts.subtitle,
        size: typeof style.fonts.subtitle.size === 'string' ? Number(style.fonts.subtitle.size) : style.fonts.subtitle.size,
      },
      body: {
        ...style.fonts.body,
        size: typeof style.fonts.body.size === 'string' ? Number(style.fonts.body.size) : style.fonts.body.size,
      },
    });
    try {
      const res = await fetch('/styles/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: style.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error?.error || data.error || 'No se pudo marcar el estilo como seleccionado.',
          confirmButtonColor: '#e11d48',
        });
        return;
      }
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#e11d48',
      });
      return;
    }
    await Swal.fire({
      icon: 'success',
      title: 'Estilo Aplicado',
      text: `El estilo "${style.name}" ha sido aplicado correctamente.`,
      confirmButtonColor: '#6366f1',
    });
    window.location.href = '/';
  }

  async function saveStyle() {
    if (!newStyleName) {
      await Swal.fire({
        icon: 'warning',
        title: 'Nombre requerido',
        text: 'Por favor, ingresa un nombre para el estilo.',
        confirmButtonColor: '#6366f1',
      });
      return;
    }
    const style = {
      name: newStyleName,
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
      weightBody: fonts.body.weight,
    };
    try {
      const res = await fetch('/styles/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(style),
      });
      const data = await res.json();
      if (!res.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error?.error || data.error || 'No se pudo guardar el estilo.',
          confirmButtonColor: '#e11d48',
        });
        return;
      }
      await Swal.fire({
        icon: 'success',
        title: 'Estilo guardado',
        text: 'El estilo se guardó correctamente en la base de datos.',
        confirmButtonColor: '#6366f1',
      });
      setNewStyleName('');
      loadSavedStyles();
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#e11d48',
      });
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
      cancelButtonColor: '#6366f1',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch('/styles/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: style.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error?.error || data.error || 'No se pudo eliminar el estilo.',
          confirmButtonColor: '#e11d48',
        });
        return;
      }
      setSavedStyles(savedStyles.filter((s) => s.name !== style.name));
      await Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El estilo ha sido eliminado.',
        confirmButtonColor: '#6366f1',
      });
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#e11d48',
      });
    }
  }

  function onFontFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'font/ttf' || file.name.endsWith('.ttf')) {
        setSelectedFontFile(file);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Archivo inválido',
          text: 'Por favor, selecciona un archivo TTF válido.',
          confirmButtonColor: '#e11d48',
        });
        input.value = '';
      }
    }
  }

  async function uploadFont() {
    if (!selectedFontFile) return;
    const formData = new FormData();
    formData.append('file', selectedFontFile);
    try {
      const res = await fetch('/styles/upload-font', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'No se pudo subir la fuente.',
          confirmButtonColor: '#e11d48',
        });
        return;
      }
      setUploadedFonts([...uploadedFonts, { name: data.file.name, url: data.file.path }]);
      await Swal.fire({
        icon: 'success',
        title: 'Fuente subida',
        text: 'La fuente se subió correctamente.',
        confirmButtonColor: '#6366f1',
      });
      window.location.reload();
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#e11d48',
      });
    }
    setSelectedFontFile(null);
  }

  function cancelFontUpload() {
    setSelectedFontFile(null);
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
      cancelButtonColor: '#6366f1',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch('/styles/delete-font', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fontName: font.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'No se pudo eliminar la fuente.',
          confirmButtonColor: '#e11d48',
        });
        return;
      }
      setUploadedFonts(uploadedFonts.filter((f) => f.name !== font.name));
      await Swal.fire({
        icon: 'success',
        title: 'Fuente eliminada',
        text: 'La fuente ha sido eliminada correctamente.',
        confirmButtonColor: '#6366f1',
      });
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#e11d48',
      });
    }
  }

  // Para el panel de preview, estilos en línea
  const previewStyle: React.CSSProperties = {
    backgroundColor: colors.background,
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
    '--font-body-weight': fonts.body.weight,
  } as React.CSSProperties;

  return (
    <>
      {showLoader && (
        <div className={`tangram-loader${fadeOut ? ' fade-out' : ''}`}>
          <Tangram />
        </div>
      )}
      <div className="personalization-root">
        {/* Encabezado y pestañas */}
        <div className="header-tabs">
          <h1>Personalización</h1>
          <div className="tabs">
            <button
              onClick={() => setActiveTab('colors')}
              className={`tab-btn${activeTab === 'colors' ? ' active' : ''}`}
            >
              Colores
            </button>
            <button
              onClick={() => setActiveTab('typography')}
              className={`tab-btn${activeTab === 'typography' ? ' active' : ''}`}
            >
              Tipografía
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`tab-btn${activeTab === 'saved' ? ' active' : ''}`}
            >
              Estilos Guardados
            </button>
          </div>
        </div>

        <div className="panel-container">
          {/* Panel de controles */}
          <div className="overflow-y-auto pr-2 custom-scrollbar">
            {/* Colores */}
            {activeTab === 'colors' && (
              <div className="card shadow-lg">
                <div className="card-header">
                  <h2 className="card-title">Controles de Color</h2>
                </div>
                <div className="card-body space-y-4">
                  {Object.entries(colorLabels).map(([key, label]) => (
                    <div className="control-group" key={key}>
                      <label>{label}</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          value={colors[key as keyof typeof colors]}
                          onChange={e => setColors({ ...colors, [key]: e.target.value })}
                        />
                        <span className="text-text">{colors[key as keyof typeof colors]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tipografía */}
            {activeTab === 'typography' && (
              <div className="card shadow-lg">
                <div className="card-header">
                  <h2 className="card-title">Controles de Tipografía</h2>
                </div>
                {/* Subir Tipografía */}
                <div className="card-body border-t border-text">
                  <h3 className="text-lg font-medium text-primary mb-3">Subir Tipografía</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <input
                        ref={fontFileInput}
                        type="file"
                        accept=".ttf"
                        onChange={onFontFileSelected}
                        className="hidden"
                      />
                      <button
                        onClick={() => fontFileInput.current && fontFileInput.current.click()}
                        className="bg-primary text-background px-4 py-2 rounded hover:bg-opacity-80"
                      >
                        Seleccionar Archivo TTF
                      </button>
                      {selectedFontFile && (
                        <span className="text-sm text-text">{selectedFontFile.name}</span>
                      )}
                    </div>
                    {selectedFontFile && (
                      <div className="flex gap-2">
                        <button onClick={uploadFont} className="bg-secondary text-background px-4 py-2 rounded hover:bg-opacity-80">
                          Subir Tipografía
                        </button>
                        <button onClick={cancelFontUpload} className="bg-accent text-background px-4 py-2 rounded hover:bg-opacity-80">
                          Cancelar
                        </button>
                      </div>
                    )}
                    {uploadedFonts.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-primary mb-2">Tipografías Subidas:</h4>
                        <div className="space-y-2">
                          {uploadedFonts.map(font => (
                            <div key={font.name} className="flex items-center justify-between p-2 bg-background rounded">
                              <span className="text-sm text-text">{font.name}</span>
                              <button onClick={() => deleteFont(font)} className="text-accent hover:text-opacity-80">
                                Eliminar
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Título */}
                <div className="card-body border-t border-text">
                  <h3 className="text-lg font-medium text-primary mb-2">Título</h3>
                  <div className="space-y-3">
                    <div>
                      <label>Fuente</label>
                      <select
                        value={fonts.title.family}
                        onChange={e => setFonts({ ...fonts, title: { ...fonts.title, family: e.target.value } })}
                      >
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                        <option value="'Courier New', monospace">Courier New</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Verdana, sans-serif">Verdana</option>
                        {uploadedFonts.map(font => (
                          <option key={font.name} value={font.name}>{font.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Tamaño (px)</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={24}
                          max={48}
                          step={1}
                          value={fonts.title.size}
                          onChange={e => setFonts({ ...fonts, title: { ...fonts.title, size: Number(e.target.value) } })}
                          className="flex-1"
                        />
                        <span className="text-sm text-text w-16">{fonts.title.size}px</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Subtítulo */}
                <div className="card-body border-t border-text">
                  <h3 className="text-lg font-medium text-primary mb-2">Subtítulo</h3>
                  <div className="space-y-3">
                    <div>
                      <label>Fuente</label>
                      <select
                        value={fonts.subtitle.family}
                        onChange={e => setFonts({ ...fonts, subtitle: { ...fonts.subtitle, family: e.target.value } })}
                      >
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                        <option value="'Courier New', monospace">Courier New</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Verdana, sans-serif">Verdana</option>
                        {uploadedFonts.map(font => (
                          <option key={font.name} value={font.name}>{font.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Tamaño (px)</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={18}
                          max={32}
                          step={1}
                          value={fonts.subtitle.size}
                          onChange={e => setFonts({ ...fonts, subtitle: { ...fonts.subtitle, size: Number(e.target.value) } })}
                          className="flex-1"
                        />
                        <span className="text-sm text-text w-16">{fonts.subtitle.size}px</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Texto */}
                <div className="card-body border-t border-text">
                  <h3 className="text-lg font-medium text-primary mb-2">Texto</h3>
                  <div className="space-y-3">
                    <div>
                      <label>Fuente</label>
                      <select
                        value={fonts.body.family}
                        onChange={e => setFonts({ ...fonts, body: { ...fonts.body, family: e.target.value } })}
                      >
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                        <option value="'Courier New', monospace">Courier New</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Verdana, sans-serif">Verdana</option>
                        {uploadedFonts.map(font => (
                          <option key={font.name} value={font.name}>{font.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Tamaño (px)</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={12}
                          max={20}
                          step={1}
                          value={fonts.body.size}
                          onChange={e => setFonts({ ...fonts, body: { ...fonts.body, size: Number(e.target.value) } })}
                          className="flex-1"
                        />
                        <span className="text-sm text-text w-16">{fonts.body.size}px</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Estilos Guardados */}
            {activeTab === 'saved' && (
              <div className="card shadow-lg">
                <div className="card-header">
                  <h2 className="card-title">Estilos Guardados</h2>
                </div>
                <div className="card-body space-y-4">
                  {/* Formulario para guardar estilo */}
                  <div className="border border-text rounded-lg p-4">
                    <h3 className="text-lg font-medium text-primary mb-3">Guardar Estilo Actual</h3>
                    <div className="space-y-3">
                      <div>
                        <label>Nombre del Estilo</label>
                        <input
                          type="text"
                          value={newStyleName}
                          onChange={e => setNewStyleName(e.target.value)}
                          placeholder="Ej: Tema Oscuro"
                        />
                      </div>
                      <button onClick={saveStyle} className="w-full">
                        Guardar Estilo
                      </button>
                    </div>
                  </div>
                  {/* Lista de estilos guardados */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-primary">Estilos Guardados</h3>
                    {savedStyles.length === 0 ? (
                      <div className="text-text text-center py-4">No hay estilos guardados</div>
                    ) : (
                      savedStyles.map(style => (
                        <div key={style.name} className="border border-text rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-primary">{style.name}</h4>
                            <div className="flex gap-2">
                              <button
                                onClick={() => applyStyle(style)}
                                className="px-3 py-1 bg-secondary text-background rounded hover:bg-opacity-80 text-sm"
                              >
                                Aplicar
                              </button>
                              <button
                                onClick={() => deleteStyle(style)}
                                className="px-3 py-1 bg-accent text-background rounded hover:bg-opacity-80 text-sm"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-5 gap-2">
                            <div className="h-8 rounded" style={{ backgroundColor: style.colors.primary }}></div>
                            <div className="h-8 rounded" style={{ backgroundColor: style.colors.secondary }}></div>
                            <div className="h-8 rounded" style={{ backgroundColor: style.colors.accent }}></div>
                            <div className="h-8 rounded" style={{ backgroundColor: style.colors.background }}></div>
                            <div className="h-8 rounded" style={{ backgroundColor: style.colors.text }}></div>
                          </div>
                          <div className="text-sm text-text">
                            <div>Fuente Principal: {style.fonts.title.family}</div>
                            <div>Tamaño Base: {style.fonts.body.size}px</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Panel de vista previa */}
          <div style={previewStyle} className="preview-content overflow-y-auto">
            <div>
              {/* Tipografía */}
              <div className="mb-6">
                <h3 style={{ color: colors.primary }} className="text-lg font-medium mb-3">Tipografía</h3>
                <div className="space-y-4">
                  <div>
                    <h1
                      style={{
                        fontFamily: fonts.title.family,
                        fontSize: fonts.title.size + 'px',
                        fontWeight: fonts.title.weight as any,
                        color: colors.primary,
                      }}
                    >
                      Título Principal
                    </h1>
                    <p style={{ color: colors.text }} className="text-sm mt-1">
                      Fuente: {fonts.title.family} | Tamaño: {fonts.title.size}px | Peso: {fonts.title.weight}
                    </p>
                  </div>
                  <div>
                    <h2
                      style={{
                        fontFamily: fonts.subtitle.family,
                        fontSize: fonts.subtitle.size + 'px',
                        fontWeight: fonts.subtitle.weight as any,
                        color: colors.primary,
                      }}
                    >
                      Subtítulo
                    </h2>
                    <p style={{ color: colors.text }} className="text-sm mt-1">
                      Fuente: {fonts.subtitle.family} | Tamaño: {fonts.subtitle.size}px | Peso: {fonts.subtitle.weight}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: fonts.body.family,
                        fontSize: fonts.body.size + 'px',
                        fontWeight: fonts.body.weight as any,
                        color: colors.text,
                      }}
                    >
                      Este es un párrafo de texto normal. Aquí puedes ver cómo se ve el texto con la fuente, tamaño y peso seleccionados.
                    </p>
                    <p style={{ color: colors.text }} className="text-sm mt-1">
                      Fuente: {fonts.body.family} | Tamaño: {fonts.body.size}px | Peso: {fonts.body.weight}
                    </p>
                  </div>
                </div>
              </div>
              {/* Aquí puedes agregar más previews de componentes si lo deseas */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Inyectar estilos globales solo una vez
const personalizationStyles = `
.personalization-root {
  min-height: 100vh;
  background: var(--color-background);
  display: flex;
  flex-direction: column;
}
.header-tabs {
  background: var(--color-background);
  padding: 2rem 1rem 0 1rem;
}
.header-tabs h1 {
  color: var(--color-primary);
  font-size: var(--font-title-size);
  font-family: var(--font-title-family);
  font-weight: var(--font-title-weight);
  margin-bottom: 1.5rem;
}
.tabs {
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid var(--color-secondary);
  background: var(--color-background);
}
.tab-btn {
  background: none;
  border: none;
  outline: none;
  color: var(--color-text);
  font-size: 1.1rem;
  font-family: var(--font-body-family);
  font-weight: 500;
  padding: 0.75rem 1.5rem 0.5rem 1.5rem;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-bottom 0.2s;
  cursor: pointer;
}
.tab-btn.active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}
.panel-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem 1rem 2rem 1rem;
  flex: 1;
}
@media (max-width: 1024px) {
  .panel-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
.card {
  background: var(--color-background);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.06);
  border: 1.5px solid var(--color-primary);
  margin-bottom: 1.5rem;
}
.card-header {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
}
.card-title {
  color: var(--color-primary);
  font-size: var(--font-subtitle-size);
  font-family: var(--font-subtitle-family);
  font-weight: var(--font-subtitle-weight);
}
.card-body {
  padding: 1.5rem;
}
.control-group label {
  color: var(--color-text);
  font-size: 1rem;
  font-family: var(--font-body-family);
  margin-bottom: 0.5rem;
  display: block;
}
input[type="color"] {
  border: 1.5px solid var(--color-primary);
  border-radius: 0.375rem;
  width: 48px;
  height: 32px;
  background: var(--color-background);
  cursor: pointer;
}
input[type="text"], select {
  width: 100%;
  padding: 0.75rem;
  border: 1.5px solid var(--color-primary);
  border-radius: 0.375rem;
  font-size: 1rem;
  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body-family);
  margin-bottom: 0.5rem;
  transition: border-color 0.2s;
}
input[type="text"]:focus, select:focus {
  outline: none;
  border-color: var(--color-secondary);
}
input[type="range"] {
  width: 100%;
  accent-color: var(--color-primary);
}
button, .btn {
  background-color: var(--color-primary);
  color: var(--color-background);
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-family: var(--font-body-family);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
button:hover, .btn:hover {
  background-color: var(--color-secondary);
  color: var(--color-background);
}
.bg-secondary {
  background-color: var(--color-secondary) !important;
  color: var(--color-background) !important;
}
.bg-accent {
  background-color: var(--color-accent) !important;
  color: var(--color-background) !important;
}
.text-primary { color: var(--color-primary) !important; }
.text-secondary { color: var(--color-secondary) !important; }
.text-accent { color: var(--color-accent) !important; }
.text-background { color: var(--color-background) !important; }
.text-text { color: var(--color-text) !important; }
.rounded-lg { border-radius: 0.75rem; }
.shadow-lg { box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08); }
.preview-content {
  background: var(--color-background);
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.06);
  border: 1.5px solid var(--color-primary);
}
/* Scrollbar personalizada */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(44, 62, 80, 0.12);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(44, 62, 80, 0.22);
}
/* Utilidades */
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-3 > * + * { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-6 { margin-bottom: 1.5rem; }
.pt-4 { padding-top: 1rem; }
.pb-4 { padding-bottom: 1rem; }
.p-2 { padding: 0.5rem; }
.p-4 { padding: 1rem; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.flex { display: flex; }
.flex-1 { flex: 1; }
.flex-none { flex: none; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.w-full { width: 100%; }
.w-16 { width: 4rem; }
.h-8 { height: 2rem; }
.h-10 { height: 2.5rem; }
.grid { display: grid; }
.grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
.lg\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.overflow-y-auto { overflow-y: auto; }
.overflow-hidden { overflow: hidden; }
.pr-2 { padding-right: 0.5rem; }
.rounded { border-radius: 0.375rem; }
.rounded-lg { border-radius: 0.75rem; }
.border { border-width: 1.5px; border-style: solid; border-color: var(--color-primary); }
.border-text { border-color: var(--color-text) !important; }
.border-t { border-top-width: 1.5px; border-top-style: solid; border-top-color: var(--color-primary); }
@media (max-width: 900px) {
  .panel-container {
    grid-template-columns: 1fr;
    padding: 1rem 0.5rem;
  }
}
@media (max-width: 600px) {
  .header-tabs { padding: 1rem 0.5rem 0 0.5rem; }
  .panel-container { padding: 1rem 0.25rem; }
  .preview-content { padding: 1rem; }
}
`;

let styleInjected = false;

const PersonalizationWithStyle: React.FC = (props) => {
  useEffect(() => {
    if (!styleInjected) {
      const styleTag = document.createElement('style');
      styleTag.innerHTML = personalizationStyles;
      document.head.appendChild(styleTag);
      styleInjected = true;
    }
  }, []);
  // @ts-ignore
  return <Personalization {...props} />;
};

export default PersonalizationWithStyle;
