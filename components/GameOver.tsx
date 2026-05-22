'use client';

import { ScoreEntry } from '@/lib/constants';
import Ranking from './Ranking';

interface Props {
  score: number;
  rankings: ScoreEntry[];
}

export default function GameOver({ score, rankings }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 24px 16px',
        overflowY: 'auto',
        touchAction: 'pan-y',
      }}
    >
      <h1
        style={{
          color: '#EF4444',
          fontFamily: 'monospace',
          fontSize: '28px',
          fontWeight: 'bold',
          letterSpacing: '4px',
          marginBottom: '12px',
        }}
      >
        GAME OVER
      </h1>

      <p
        style={{
          color: '#FFFFFF',
          fontFamily: 'monospace',
          fontSize: '20px',
          letterSpacing: '2px',
          marginBottom: '8px',
        }}
      >
        {(score / 10).toFixed(1)}s
      </p>

      <p
        style={{
          color: '#AAAAAA',
          fontFamily: 'monospace',
          fontSize: '12px',
          letterSpacing: '2px',
          marginBottom: '24px',
          textAlign: 'center',
          lineHeight: '2',
          animation: 'blink 1.2s step-start infinite',
        }}
      >
        TAP TO RETRY
        <br />
        <span style={{ fontSize: '10px', letterSpacing: '1px' }}>or PRESS SPACE</span>
      </p>

      <div
        style={{
          width: '100%',
          maxWidth: '360px',
        }}
      >
        <p
          style={{
            color: '#555555',
            fontFamily: 'monospace',
            fontSize: '10px',
            letterSpacing: '2px',
            marginBottom: '8px',
          }}
        >
          RANKING
        </p>
        <Ranking entries={rankings} />
      </div>
    </div>
  );
}
