'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useGame } from '@/hooks/useGame';
import StartScreen from './StartScreen';
import GameOver from './GameOver';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import { drawBackground, drawPlayer, drawObstacle, drawScore } from '@/lib/gameEngine';

const BUTTON_AREA_HEIGHT = 100;
const TOTAL_HEIGHT = CANVAS_HEIGHT + BUTTON_AREA_HEIGHT;

function ChevronLeft() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <polyline
        points="25,8 14,20 25,32"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <polyline
        points="15,8 26,20 15,32"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    gameState,
    score,
    rankings,
    update,
    playerRef,
    obstaclesRef,
    gameStateRef,
    scoreRef,
    startGame,
    pressKey,
    releaseKey,
  } = useGame();
  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const s = Math.min(1, window.innerWidth / CANVAS_WIDTH, window.innerHeight / TOTAL_HEIGHT);
      setScale(s);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (time: number) => {
      const delta = lastTimeRef.current ? time - lastTimeRef.current : 0;
      lastTimeRef.current = time;

      update(Math.min(delta, 50));

      drawBackground(ctx);

      const state = gameStateRef.current;
      if (state === 'playing' || state === 'gameover') {
        for (const obs of obstaclesRef.current) {
          drawObstacle(ctx, obs);
        }
        drawPlayer(ctx, playerRef.current);
        drawScore(ctx, scoreRef.current);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContainerPointerDown = useCallback(() => {
    const state = gameStateRef.current;
    if (state === 'start' || state === 'gameover') {
      startGame();
    }
  }, [gameStateRef, startGame]);

  const handleLeftDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    pressKey('ArrowLeft');
  }, [pressKey]);

  const handleLeftUp = useCallback(() => releaseKey('ArrowLeft'), [releaseKey]);

  const handleRightDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    pressKey('ArrowRight');
  }, [pressKey]);

  const handleRightUp = useCallback(() => releaseKey('ArrowRight'), [releaseKey]);

  const btnStyle: React.CSSProperties = {
    flex: 1,
    height: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'none',
    pointerEvents: 'auto',
    WebkitTapHighlightColor: 'transparent',
  };

  return (
    <div
      style={{
        width: CANVAS_WIDTH * scale,
        height: TOTAL_HEIGHT * scale,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: CANVAS_WIDTH,
          height: TOTAL_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          touchAction: gameState === 'playing' ? 'none' : 'manipulation',
        }}
        onPointerDown={handleContainerPointerDown}
      >
        {/* Canvas area */}
        <div
          style={{
            position: 'relative',
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            outline: '1px solid #1a1a1a',
          }}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{ display: 'block' }}
          />
          {gameState === 'start' && <StartScreen />}
          {gameState === 'gameover' && <GameOver score={score} rankings={rankings} />}
        </div>

        {/* Button area — below canvas, outside player movement zone */}
        <div
          style={{
            width: CANVAS_WIDTH,
            height: BUTTON_AREA_HEIGHT,
            background: '#000000',
            display: 'flex',
            gap: 8,
            padding: 8,
            pointerEvents: 'none',
          }}
        >
          <button
            style={{
              ...btnStyle,
              opacity: gameState === 'playing' ? 1 : 0,
            }}
            onPointerDown={handleLeftDown}
            onPointerUp={handleLeftUp}
            onPointerCancel={handleLeftUp}
            onPointerLeave={handleLeftUp}
          >
            <ChevronLeft />
          </button>
          <button
            style={{
              ...btnStyle,
              opacity: gameState === 'playing' ? 1 : 0,
            }}
            onPointerDown={handleRightDown}
            onPointerUp={handleRightUp}
            onPointerCancel={handleRightUp}
            onPointerLeave={handleRightUp}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
