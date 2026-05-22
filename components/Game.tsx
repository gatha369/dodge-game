'use client';

import { useRef, useEffect } from 'react';
import { useGame } from '@/hooks/useGame';
import StartScreen from './StartScreen';
import GameOver from './GameOver';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import { drawBackground, drawPlayer, drawObstacle, drawScore } from '@/lib/gameEngine';

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, score, rankings, update, playerRef, obstaclesRef, gameStateRef, scoreRef } =
    useGame();
  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (time: number) => {
      const delta = lastTimeRef.current ? time - lastTimeRef.current : 0;
      lastTimeRef.current = time;

      // Cap delta to avoid huge jumps after tab switch
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

  return (
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
  );
}
