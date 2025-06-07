import { vi } from 'vitest';

export function setupCanvasMock(): void {
  HTMLCanvasElement.prototype.getContext = function (contextId: string): any {
    if (contextId === '2d') {
      return {
        // Canvas ref
        canvas: this as HTMLCanvasElement,

        // State
        save: vi.fn(),
        restore: vi.fn(),
        resetTransform: vi.fn(),
        getTransform: vi.fn().mockReturnValue({}),
        setTransform: vi.fn(),
        transform: vi.fn(),
        scale: vi.fn(),
        rotate: vi.fn(),
        translate: vi.fn(),

        // Drawing
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        strokeRect: vi.fn(),
        beginPath: vi.fn(),
        closePath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        arc: vi.fn(),
        arcTo: vi.fn(),
        rect: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        clip: vi.fn(),

        // Text
        fillText: vi.fn(),
        strokeText: vi.fn(),
        measureText: vi.fn().mockReturnValue({
          width: 0,
          actualBoundingBoxLeft: 0,
          actualBoundingBoxRight: 0,
          fontBoundingBoxAscent: 0,
          fontBoundingBoxDescent: 0,
          actualBoundingBoxAscent: 0,
          actualBoundingBoxDescent: 0,
        }),

        // Path
        isPointInPath: vi.fn().mockReturnValue(false),
        isPointInStroke: vi.fn().mockReturnValue(false),
        setLineDash: vi.fn(),
        getLineDash: vi.fn().mockReturnValue([]),

        // Gradients / patterns
        createLinearGradient: vi.fn().mockReturnValue({
          addColorStop: vi.fn(),
        }),
        createRadialGradient: vi.fn().mockReturnValue({
          addColorStop: vi.fn(),
        }),
        createPattern: vi.fn(),

        // Image data
        drawImage: vi.fn(),
        getImageData: vi.fn().mockReturnValue({
          data: new Uint8ClampedArray(),
          width: 0,
          height: 0,
        }),
        putImageData: vi.fn(),
        createImageData: vi.fn().mockReturnValue({
          data: new Uint8ClampedArray(),
          width: 0,
          height: 0,
        }),
      };
    } else if (contextId === 'bitmaprenderer') {
      return {
        transferFromImageBitmap: vi.fn(),
        canvas: this as HTMLCanvasElement,
      };
    } else if (contextId === 'webgl' || contextId === 'webgl2') {
      return {
        canvas: this as HTMLCanvasElement,
        // Optionally mock WebGL methods if needed
      };
    }

    return null;
  };
}
