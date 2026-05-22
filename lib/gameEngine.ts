import { CANVAS_WIDTH, CANVAS_HEIGHT, Player, Obstacle } from './constants';

export function drawBackground(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

export function drawObstacle(ctx: CanvasRenderingContext2D, obstacle: Obstacle): void {
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

export function drawScore(ctx: CanvasRenderingContext2D, score: number): void {
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '16px monospace';
  ctx.textBaseline = 'top';
  ctx.fillText(`SCORE: ${(score / 10).toFixed(1)}`, 16, 16);
}

export function checkCollision(player: Player, obstacle: Obstacle): boolean {
  return (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  );
}
