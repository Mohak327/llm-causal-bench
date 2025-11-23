import { Point } from './Point/Point.controller';
import type { IPhysicsSimulation, SimulationConfig, IPointSimulationConfig } from './Physics.interface';

export type PhysicsType = 'point';

export class PhysicsService {
  static createSimulation(
    type: PhysicsType,
    config: SimulationConfig
  ): IPhysicsSimulation {
    switch (type) {
      case 'point':
        const pointConfig = config as IPointSimulationConfig;
        return new Point(pointConfig.x, pointConfig.y, pointConfig.pointConfig);
      default:
        throw new Error(`Unknown physics simulation type: ${type}`);
    }
  }
}
