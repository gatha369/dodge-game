'use client';

export default function StartScreen() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        pointerEvents: 'none',
      }}
    >
      <p
        style={{
          color: '#EF4444',
          fontSize: '11px',
          letterSpacing: '0.2em',
          margin: '0 0 12px',
        }}
      >
        DODGE
      </p>

      <h1
        style={{
          color: '#FFFFFF',
          fontSize: '52px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          margin: 0,
        }}
      >
        DODGE
      </h1>

      <div
        style={{
          width: 48,
          height: 2,
          background: '#EF4444',
          marginTop: 12,
          marginBottom: 48,
        }}
      />

      <p
        style={{
          color: '#FFFFFF',
          fontSize: '13px',
          letterSpacing: '0.15em',
          margin: '0 0 20px',
          animation: 'blink 1.2s step-start infinite',
        }}
      >
        PRESS ANY KEY TO START
      </p>

      <p
        style={{
          color: '#555555',
          fontSize: '11px',
          letterSpacing: '0.1em',
          margin: 0,
        }}
      >
        ← → to move · avoid the blocks
      </p>

      <p
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#333333',
          fontSize: '10px',
          letterSpacing: '0.12em',
          margin: 0,
        }}
      >
        by Keiichiro Nagaoka
      </p>
    </div>
  );
}
