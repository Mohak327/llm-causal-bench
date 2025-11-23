export interface IPhysicsSimulation {
  update(t: number, energy: number, mouse: { x: number; y: number }): void;
  draw(context: CanvasRenderingContext2D, energy: number): void;
}

export interface IPointSimulationConfig {
  x: number;
  y: number;
  pointConfig: import('./Point/Point.interface').PointConfig;
}

export type SimulationConfig = IPointSimulationConfig;
