import { Canvas } from '$lib/canvas';
import type { BassVisual } from './BassVisual';

export const BASS_STRING = {
  MAX_OFFSET_X: 35,
  WIDTH: 4,
}

export class BassString {
  visual: BassVisual;
  x: number;
  offsetX: number;
  speed: number;

  constructor(visual: BassVisual, x: number) {
    this.visual = visual;
    this.x = x;

    this.offsetX = 0;
    this.speed = 0;
  }

  move() {
    const { mousePos } = this.visual.getUserPosition();

    // if the mousePosition would push
  }

  draw() {
    const { H } = this.visual.getSize();
    Canvas.draw(
      this.visual.getContext(), {
        position: { x: this.x, y: 0 },
        layers: [
          {
            id: 'string',
            strokes: [
              ['moveTo', 0, 0],
              ['lineTo', 0, H],
            ],
            lineWidth: BASS_STRING.WIDTH,
            strokeStyle: '#fff',
          },
        ]
      }
    );
  }
}

