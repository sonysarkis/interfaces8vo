import React, { useEffect, useState } from 'react';

const LS_KEY = 'showTangramLoader';

const LoaderSwitch: React.FC = () => {
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(LS_KEY);
        if (stored === null) {
            localStorage.setItem(LS_KEY, 'true');
            setEnabled(true);
        } else {
            setEnabled(stored === 'true');
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnabled(e.target.checked);
        localStorage.setItem(LS_KEY, e.target.checked ? 'true' : 'false');
    };

    return (
        <div className="loader-switch-container">
            <label className="loader-switch-label">
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={handleChange}
                    className="loader-switch-input"
                />
                <span className="loader-switch-slider" />
                <span className="loader-switch-text">
                    Loader Tangram: {enabled ? 'ACTIVADO' : 'DESACTIVADO'}
                </span>
            </label>
        </div>
    );
};

export default LoaderSwitch;

/*
Estilos sugeridos para main.css:
.loader-switch-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
}
.loader-switch-label {
  display: flex;
  align-items: center;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-primary);
  cursor: pointer;
}
.loader-switch-input {
  display: none;
}
.loader-switch-slider {
  width: 48px;
  height: 24px;
  background: var(--color-background);
  border: 2px solid var(--color-primary);
  border-radius: 24px;
  margin-right: 1rem;
  position: relative;
  transition: background 0.2s;
}
.loader-switch-input:checked + .loader-switch-slider {
  background: var(--color-secondary);
}
.loader-switch-slider::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 4px;
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 50%;
  transition: transform 0.2s;
}
.loader-switch-input:checked + .loader-switch-slider::before {
  transform: translateX(24px);
  background: var(--color-background);
}
.loader-switch-text {
  margin-left: 0.5rem;
}
*/
