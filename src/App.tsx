import React from 'react';
import RoutesList from './router';

const App: React.FC = () => {
  return (
    <>
      <header>
        <div className="wrapper">
          <nav>
            {/* Aquí podría ir una barra de navegación */}
          </nav>
        </div>
      </header>
      <RoutesList />
    </>
  );
};

export default App;
