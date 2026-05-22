'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useGame } from '@/hooks/useGame';
import StartScreen from './StartScreen';
import GameOver from './GameOver';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import { drawBackground, drawPlayer, drawObstacle, drawScore } from '@/lib/gameEngine';

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
      const s = Math.min(1, window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT);
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

  return (
    <div
      style={{
        width: CANVAS_WIDTH * scale,
        height: CANVAS_HEIGHT * scale,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          outline: '1px solid #1a1a1a',
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          touchAction: gameState === 'playing' ? 'none' : 'manipulation',
        }}
        onPointerDown={handleContainerPointerDown}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{ display: 'block' }}
        />
        {gameState === 'start' && <StartScreen />}
        {gameState === 'gameover' && <GameOver score={score} rankings={rankings} />}
        {gameState === 'playing' && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
              display: 'flex',
              gap: 8,
              padding: 8,
              pointerEvents: 'none',
            }}
          >
            <button
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10,
                color: 'rgba(255,255,255,0.55)',
                fontSize: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                touchAction: 'none',
                pointerEvents: 'auto',
                WebkitTapHighlightColor: 'transparent',
              }}
              onPointerDown={handleLeftDown}
              onPointerUp={handleLeftUp}
              onPointerCancel={handleLeftUp}
              onPointerLeave={handleLeftUp}
            >
              ←
            </button>
            <button
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10,
                color: 'rgba(255,255,255,0.55)',
                fontSize: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                touchAction: 'none',
                pointerEvents: 'auto',
                WebkitTapHighlightColor: 'transparent',
              }}
              onPointerDown={handleRightDown}
              onPointerUp={handleRightUp}
              onPointerCancel={handleRightUp}
              onPointerLeave={handleRightUp}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
