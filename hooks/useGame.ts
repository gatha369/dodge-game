'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_START_Y,
  PLAYER_SPEED,
  OBSTACLE_HEIGHT,
  OBSTACLE_NORMAL_MIN_WIDTH,
  OBSTACLE_NORMAL_MAX_WIDTH,
  OBSTACLE_WIDE_WIDTH,
  OBSTACLE_WIDE_CHANCE,
  OBSTACLE_BASE_SPEED,
  OBSTACLE_SPEED_SCALE,
  OBSTACLE_SPAWN_INTERVAL,
  SCORE_UNIT_MS,
  RANKING_MAX_ENTRIES,
  STORAGE_KEY,
  GameState,
  Player,
  Obstacle,
  ScoreEntry,
} from '@/lib/constants';
import { checkCollision } from '@/lib/gameEngine';

function loadRankings(): ScoreEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveScore(score: number): void {
  const entries = loadRankings();
  entries.push({ score, date: new Date().toISOString() });
  entries.sort((a, b) => b.score - a.score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, RANKING_MAX_ENTRIES)));
}

function createPlayer(): Player {
  return {
    x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: PLAYER_START_Y,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  };
}

function spawnObstacle(speed: number): Obstacle {
  const isWide = Math.random() < OBSTACLE_WIDE_CHANCE;
  const width = isWide
    ? OBSTACLE_WIDE_WIDTH
    : OBSTACLE_NORMAL_MIN_WIDTH +
      Math.random() * (OBSTACLE_NORMAL_MAX_WIDTH - OBSTACLE_NORMAL_MIN_WIDTH);
  return {
    x: Math.random() * (CANVAS_WIDTH - width),
    y: -OBSTACLE_HEIGHT,
    width,
    height: OBSTACLE_HEIGHT,
    speed,
  };
}

export function useGame() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [rankings, setRankings] = useState<ScoreEntry[]>([]);

  const playerRef = useRef<Player>(createPlayer());
  const obstaclesRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef(0);
  const elapsedRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const speedRef = useRef(OBSTACLE_BASE_SPEED);
  const keysRef = useRef<Set<string>>(new Set());
  const gameStateRef = useRef<GameState>('start');

  const endGame = useCallback(() => {
    const finalScore = scoreRef.current;
    setScore(finalScore);
    saveScore(finalScore);
    setRankings(loadRankings());
    gameStateRef.current = 'gameover';
    setGameState('gameover');
  }, []);

  const startGame = useCallback(() => {
    playerRef.current = createPlayer();
    obstaclesRef.current = [];
    scoreRef.current = 0;
    elapsedRef.current = 0;
    lastSpawnRef.current = 0;
    speedRef.current = OBSTACLE_BASE_SPEED;
    setScore(0);
    gameStateRef.current = 'playing';
    setGameState('playing');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      keysRef.current.add(e.key);

      if (gameStateRef.current === 'start') {
        startGame();
      } else if (gameStateRef.current === 'gameover' && e.key === ' ') {
        startGame();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startGame]);

  const update = useCallback(
    (deltaTime: number) => {
      if (gameStateRef.current !== 'playing') return;

      const player = playerRef.current;

      if (keysRef.current.has('ArrowLeft')) {
        player.x = Math.max(0, player.x - PLAYER_SPEED);
      }
      if (keysRef.current.has('ArrowRight')) {
        player.x = Math.min(CANVAS_WIDTH - player.width, player.x + PLAYER_SPEED);
      }

      elapsedRef.current += deltaTime;
      const newScore = Math.floor(elapsedRef.current / SCORE_UNIT_MS);
      if (newScore !== scoreRef.current) {
        scoreRef.current = newScore;
        setScore(newScore);
      }

      speedRef.current = OBSTACLE_BASE_SPEED + elapsedRef.current * OBSTACLE_SPEED_SCALE;

      const spawnInterval = Math.max(400, OBSTACLE_SPAWN_INTERVAL - elapsedRef.current * 0.05);
      if (elapsedRef.current - lastSpawnRef.current >= spawnInterval) {
        obstaclesRef.current.push(spawnObstacle(speedRef.current));
        lastSpawnRef.current = elapsedRef.current;
      }

      const obstacles = obstaclesRef.current;
      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += obstacles[i].speed;
        obstacles[i].speed = speedRef.current;

        if (obstacles[i].y > CANVAS_HEIGHT) {
          obstacles.splice(i, 1);
          continue;
        }

        if (checkCollision(player, obstacles[i])) {
          endGame();
          return;
        }
      }
    },
    [endGame]
  );

  useEffect(() => {
    setRankings(loadRankings());
  }, []);

  return { gameState, gameStateRef, score, rankings, update, playerRef, obstaclesRef, scoreRef };
}
