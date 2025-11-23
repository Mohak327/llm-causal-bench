'use client';
import React, { useEffect, useRef } from 'react';
import { PhysicsService } from '../../services/physics/Physics.service';
import type { IPhysicsSimulation } from '../../services/physics/Physics.interface';
import * as CONFIG from './EnergyField.config';
import EnergyFieldView from './EnergyField.view';

const EnergyFieldController: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<IPhysicsSimulation[]>([]);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const energyRef = useRef(0);
  const timeRef = useRef(0);
  const lastScrollYRef = useRef(window.scrollY);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const init = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      pointsRef.current = [];

      const energyFieldConfig = {
        DISRUPTION_RADIUS: CONFIG.DISRUPTION_RADIUS,
        WAVE_LENGTH: CONFIG.WAVE_LENGTH,
        VISCOSITY: CONFIG.VISCOSITY,
        ELASTICITY: CONFIG.ELASTICITY,
        DAMPING: CONFIG.DAMPING,
      };

      for (let x = 0; x <= width; x += CONFIG.GRID_SPACING) {
        for (let y = 0; y <= height; y += CONFIG.GRID_SPACING) {
          pointsRef.current.push(PhysicsService.createSimulation('point', { x, y, pointConfig: energyFieldConfig }));
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      timeRef.current += 0.04;
      energyRef.current *= CONFIG.ENERGY_DECAY;

      const currentScrollY = window.scrollY;
      const scrollSpeed = Math.abs(currentScrollY - lastScrollYRef.current);
      
      if (scrollSpeed > 0) {
        energyRef.current += scrollSpeed * CONFIG.SCROLL_MULTIPLIER;
        energyRef.current = Math.min(energyRef.current, 2.5);
      }
      lastScrollYRef.current = currentScrollY;

      if (energyRef.current < 0.001) energyRef.current = 0;

      pointsRef.current.forEach(p => {
        p.update(timeRef.current, energyRef.current, mouseRef.current);
        p.draw(ctx, energyRef.current);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      energyRef.current = Math.max(energyRef.current, 1);
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <EnergyFieldView canvasRef={canvasRef} />;
};

export default EnergyFieldController;
