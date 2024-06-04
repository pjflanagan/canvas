import { Canvas } from '$lib/canvas';
import type { Point } from '$lib/util';
import type { BassVisual } from './BassVisual';
import { Motion } from '../../lib/util/Motion';
import { Geometry } from '../../lib/util/Geometry';

export const BASS_STRING = {
  MAX_OFFSET_X: 35,
  WIDTH: 4,
}

export class BassString {
  visual: BassVisual;
  position: Point;
  pullPoint: Point;
  state: 'held' | 'released';
  to: Point;

  constructor(visual: BassVisual, x: number) {
    this.visual = visual;
    this.position = { x, y: 0 };

    const { H } = this.visual.getSize();
    this.pullPoint = { x: 0, y: H / 2 };
    this.state = 'released';
    this.to = this.pullPoint;
  }

  move() {
    const { mousePos } = this.visual.getUserPosition();

    // if the pointer has reached the string we consider the string being held
    if (Motion.isClose(mousePos.x, this.position.x, 4)) {
      this.state = 'held';
    } else if (!Motion.isClose(mousePos.x, this.position.x, BASS_STRING.MAX_OFFSET_X)) {
      this.state = 'released';
    }

    if (this.state === 'held') {
      this.pullPoint = Geometry.difference(mousePos, this.position);
    } else {
      // this.to will be set to (-1 * pullPoint.x, y - 1) once we get there we set a new this.to
    }
  }

  draw() {
    const { H } = this.visual.getSize();
    Canvas.draw(
      this.visual.getContext(), {
        position: this.position,
        layers: [
          {
            id: 'string',
            strokes: [
              ['moveTo', 0, 0],
              ['quadraticCurveTo', this.pullPoint.x, this.pullPoint.y, 0, H],
            ],
            lineWidth: BASS_STRING.WIDTH,
            strokeStyle: '#fff',
          },
        ]
      }
    );
  }
}

