import type { PointConfig } from "./Point.interface";

export class Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  baseSize: number;
  config: PointConfig;

  constructor(x: number, y: number, config: PointConfig) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.baseSize = 1.2;
    this.config = config;
  }

  update(t: number, energy: number, mouse: { x: number; y: number }) {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.config.DISRUPTION_RADIUS && energy > 0.01) {
      const force = (this.config.DISRUPTION_RADIUS - dist) / this.config.DISRUPTION_RADIUS;
      const wave = Math.sin(dist / this.config.WAVE_LENGTH - t * 8);
      const power = force * wave * energy * 5;

      const angle = Math.atan2(dy, dx);
      this.vx -= Math.cos(angle) * power * this.config.VISCOSITY;
      this.vy -= Math.sin(angle) * power * this.config.VISCOSITY;
    }

    const flow = Math.sin(this.originY * 0.01 + t) * Math.cos(this.originX * 0.01 + t) * 0.02;
    this.vx += flow;

    const springX = (this.originX - this.x) * this.config.ELASTICITY;
    const springY = (this.originY - this.y) * this.config.ELASTICITY;

    this.vx += springX;
    this.vy += springY;

    this.vx *= this.config.DAMPING;
    this.vy *= this.config.DAMPING;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(context: CanvasRenderingContext2D, energy: number) {
    const speed = Math.abs(this.vx) + Math.abs(this.vy);
    const alpha = Math.min(0.1 + speed * 0.15, 0.8);

    if (energy > 0.01 && speed > 0.1) {
      const hue = (this.originX + this.originY) % 360;
      context.fillStyle = `hsla(${hue}, 90%, 70%, ${alpha * 2})`;
    } else {
      context.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    }

    context.beginPath();
    context.arc(this.x, this.y, this.baseSize, 0, Math.PI * 2);
    context.fill();
  }
}
