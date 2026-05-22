export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 640;

export const PLAYER_WIDTH = 32;
export const PLAYER_HEIGHT = 32;
export const PLAYER_SPEED = 5;
export const PLAYER_START_Y = CANVAS_HEIGHT - 60;

export const OBSTACLE_HEIGHT = 20;
export const OBSTACLE_NORMAL_MIN_WIDTH = 32;
export const OBSTACLE_NORMAL_MAX_WIDTH = 80;
export const OBSTACLE_WIDE_WIDTH = 140;
export const OBSTACLE_WIDE_CHANCE = 0.2;
export const OBSTACLE_BASE_SPEED = 3;
export const OBSTACLE_SPEED_SCALE = 0.0001; // added to base speed per ms elapsed
export const OBSTACLE_SPAWN_INTERVAL = 1200; // ms

export const RANKING_MAX_ENTRIES = 10;
export const SCORE_UNIT_MS = 100; // 1 score unit = 0.1 second

export const STORAGE_KEY = 'dodge-game-rankings';

export type GameState = 'start' | 'playing' | 'gameover';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface ScoreEntry {
  score: number;
  date: string; // ISO string
}
