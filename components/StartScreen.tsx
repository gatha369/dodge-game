'use client';

export default function StartScreen() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        pointerEvents: 'none',
      }}
    >
      <h1
        style={{
          color: '#FFFFFF',
          fontFamily: 'monospace',
          fontSize: '32px',
          fontWeight: 'bold',
          letterSpacing: '4px',
        }}
      >
        DODGE GAME
      </h1>
      <p
        style={{
          color: '#AAAAAA',
          fontFamily: 'monospace',
          fontSize: '14px',
          letterSpacing: '2px',
          animation: 'blink 1.2s step-start infinite',
        }}
      >
        PRESS ANY KEY TO START
      </p>
      <div
        style={{
          color: '#555555',
          fontFamily: 'monospace',
          fontSize: '12px',
          textAlign: 'center',
          lineHeight: '1.8',
        }}
      >
        ← → to move
      </div>
    </div>
  );
}
