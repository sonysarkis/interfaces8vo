import Spline from '@splinetool/react-spline';

export default function Tangram() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <span
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -180%)',
          fontFamily: 'var(--font-title-family)',
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--color-primary)',
          letterSpacing: '2px',
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
          textShadow: '0 2px 8px var(--color-background)'
        }}
      >
        LOADING...
      </span>
      <Spline scene="https://prod.spline.design/8mv3eS7xaaNvEr-0/scene.splinecode" />
    </div>
  );
}