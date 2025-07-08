import React, { useState } from 'react';

const Personalization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'saved'>('colors');

  return (
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
        {/* Aquí irán los paneles de controles según la pestaña activa */}
        {/* Panel de Colores */}
        {activeTab === 'colors' && (
          <div className="card shadow-lg">
            <div className="card-header">
              <h2 className="card-title">Controles de Color</h2>
            </div>
            {/* ...panel de colores... */}
          </div>
        )}
        {/* Panel de Tipografía */}
        {activeTab === 'typography' && (
          <div className="card shadow-lg">
            <div className="card-header">
              <h2 className="card-title">Controles de Tipografía</h2>
            </div>
            {/* ...panel de tipografía... */}
          </div>
        )}
        {/* Panel de Estilos Guardados */}
        {activeTab === 'saved' && (
          <div className="card shadow-lg">
            <div className="card-header">
              <h2 className="card-title">Estilos Guardados</h2>
            </div>
            {/* ...panel de estilos guardados... */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Personalization; 