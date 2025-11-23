import React from 'react';

interface EnergyFieldViewProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const EnergyFieldView: React.FC<EnergyFieldViewProps> = ({ canvasRef }) => {
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] bg-[#f0f0f0] pointer-events-none"
    />
  );
};

export default EnergyFieldView;
