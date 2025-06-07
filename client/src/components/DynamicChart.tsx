import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';

export function DynamicChart({ config }: { config: ChartConfiguration }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof canvas.getContext !== 'function') return;
    try {
      const chart = new Chart(canvas, config);
      return () => chart.destroy();
    } catch {
      // ignore in non-browser environments
    }
  }, [config]);

  return <canvas ref={canvasRef} aria-label="chart" />;
}
