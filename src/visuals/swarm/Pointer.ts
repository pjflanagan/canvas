import { Canvas, type DrawingInstructions } from '$lib/canvas';
import { Color, Geometry, Random, type Point } from '$lib/util';
import { Member, MovementType } from './Member';
import type { SwarmVisual } from './SwarmVisual';

const POINTER_ROTATIONAL_SPEED = {
  min: 0.02,
  max: 0.12,
};

const POINTER_SPEED = {
  min: 2.6,
  max: 4.8,
};

const POINTER = {
  LENGTH: 26,
  ANGLE: 0.25,
};

function getArrowDrawingInstructions(
  position: Point,
  rotation: number,
  color: string,
): DrawingInstructions {
  return {
    position: position,
    layers: [
      {
        id: 'pointer',
        strokes: [
          ['moveTo', 0, 0],
          [
            'lineTo',
            Math.sin(rotation - POINTER.ANGLE) * POINTER.LENGTH,
            Math.cos(rotation - POINTER.ANGLE) * POINTER.LENGTH,
          ],
          [
            'lineTo',
            Math.sin(rotation + POINTER.ANGLE) * POINTER.LENGTH,
            Math.cos(rotation + POINTER.ANGLE) * POINTER.LENGTH,
          ],
        ],
        fillStyle: color,
      },
    ],
  };
}

export class Pointer extends Member {
  draw() {
    Canvas.draw(
      this.visual.getContext(),
      getArrowDrawingInstructions(this.position, this.rotation, Color.toString(this.color)),
    );
  }

  drawLineToToPoint() {
    const to = this.getToPoint();
    if (to) {
      Canvas.draw(this.visual.getContext(), {
        position: this.position,
        layers: [
          {
            id: 'line',
            strokes: [
              ['moveTo', this.position.x, this.position.y],
              ['lineTo', to.x, to.y],
            ],
            strokeStyle: this.getMotionColor() + '4',
          },
        ],
      });
    }
  }

  getColor() {
    switch (this.movement.movementType) {
      case MovementType.FOLLOWING:
        return this.movement.following.color;
      case MovementType.TO:
      default:
        return this.color;
    }
  }

  getMotionColor() {
    switch (this.movement.movementType) {
      case MovementType.MOUSE_TO:
        return Color.toString({
          r: 0,
          g: 0,
          b: 0,
          a:
            1 -
            Geometry.distance(this.position, this.visual.getUserPosition().mousePos) /
              this.visual.getSize().diagonalLength,
        });
      case MovementType.FOLLOWING:
        return Color.toString({
          r: 0,
          g: 0,
          b: 255,
          a:
            1 -
            Geometry.distance(this.position, this.movement.following.getTailPoint()) /
              this.visual.getSize().diagonalLength,
        });
      case MovementType.TO:
      default:
        return Color.toString({
          r: 255,
          g: 0,
          b: 0,
          a:
            1 -
            Geometry.distance(this.position, this.movement.to) /
              this.visual.getSize().diagonalLength,
        });
    }
  }
}

export function makePointer(visual: SwarmVisual): Pointer {
  const properties = {
    color: Color.getRandomColor(),
    rotationalSpeed: Random.propFloat(POINTER_ROTATIONAL_SPEED),
    speed: Random.propFloat(POINTER_SPEED),
    length: POINTER.LENGTH,
  };
  return new Pointer(visual, properties);
}
