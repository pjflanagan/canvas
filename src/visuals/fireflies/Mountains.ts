import { Canvas } from '$lib/canvas';
import { Random, type Point } from '$lib/util';
import type { FireflyVisual } from './FireflyVisual';

export class Mountain {
  visual: FireflyVisual;
  peakPosition: Point;
  baseWidth: number;

  // branches: Branch[];

  constructor(visual: FireflyVisual) {
    this.visual = visual;

    const { W, H } = visual.getSize();
    const mountainYCoordRange = H / 6;
    this.peakPosition = {
      x: Random.float(0, W),
      y: Random.number(mountainYCoordRange - 100, mountainYCoordRange + 100),
    };
    this.baseWidth = Random.number((5 * W) / 6, (9 * W) / 6);
  }

  draw() {
    const { H } = this.visual.getSize();
    Canvas.draw(this.visual.getContext(), {
      layers: [
        {
          id: 'mountain',
          strokes: [
            ['moveTo', this.peakPosition.x, this.peakPosition.y],
            ['lineTo', this.peakPosition.x + 0.5 * this.baseWidth, H],
            ['lineTo', this.peakPosition.x + -0.5 * this.baseWidth, H],
          ],
          fillStyle: '#0002',
        },
      ],
    });
  }

  move() {
    return;
  }
}
