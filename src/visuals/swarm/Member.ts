import { Canvas, type DrawingInstructions } from '$lib/canvas';
import { Color, Geometry, Motion, Random, type Point } from '$lib/util';
import type { SwarmVisual } from './SwarmVisual';

// TODO: these should either be birds, or fish
// I'm sure I could make a decent looking fish

const MEMBER = {
	LENGTH: 26,
	ANGLE: 0.25,
	ROTATIONAL_SPEED: {
    min: 0.02,
    max: 0.12
  },
	SPEED: {
    min: 2.6,
    max: 4.8
  }
};

enum MovementType {
	TO,
	FOLLOWING,
	MOUSE_FLEE,
  MOUSE_TO
}

function getRandomMovementType(): MovementType {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return Random.arrayItemWeighted(
    [MovementType.TO,  MovementType.FOLLOWING, MovementType.MOUSE_TO],
    [6, 5, 2]
  )!;
}

function getArrowDrawingInstructions(position: Point, rotation: number, color: string): DrawingInstructions {
  return {
    position: position,
    layers: [
      {
        id: 'pointer',
        strokes: [
          ['moveTo', 0, 0],
          [
            'lineTo',
            Math.sin(rotation - MEMBER.ANGLE) * MEMBER.LENGTH,
            Math.cos(rotation - MEMBER.ANGLE) * MEMBER.LENGTH
          ],
          [
            'lineTo',
            Math.sin(rotation + MEMBER.ANGLE) * MEMBER.LENGTH,
            Math.cos(rotation + MEMBER.ANGLE) * MEMBER.LENGTH
          ]
        ],
        fillStyle: color,
      }
    ]
  }
}

// function getFishDrawingInstructions(position: Point, rotation: number): DrawingInstructions {
//   return {
//     position,
//     layers: [
//       {
//         id: 'head',
//         strokes: [
//           ['ellipse', 0, 8, 6, 16, rotation, 0, Math.PI * 2, false]
//         ],
//         fillStyle: '#f14d10'
//       }
//     ]
//   }
// }

export class Member {
	visual: SwarmVisual;
	movement: {
		movementType: MovementType;
		to: Point;
		following: Member;
	};
	position: Point;
	rotation: number;
	color: string;
  rotationalSpeed: number;
  speed: number;

	constructor(visual: SwarmVisual) {
		this.visual = visual;

		this.color = Color.toString(Color.getRandomColor());
    this.rotationalSpeed = Random.prop(MEMBER.ROTATIONAL_SPEED);
    this.speed = Random.prop(MEMBER.SPEED);
  
		this.movement = {
			movementType: MovementType.TO,
			to: this.visual.getRandomInboundsPoint(),
			following: this // placeholder
		};
		this.position = this.visual.getRandomInboundsPoint();
		this.rotation = Random.float(-Math.PI, Math.PI);
	}

	getToPoint(): Point {
		switch (this.movement.movementType) {
			case MovementType.MOUSE_TO:
				return this.visual.getUserPosition().mousePos;
			case MovementType.FOLLOWING:
				return this.movement.following.getTailPoint();
      case MovementType.MOUSE_FLEE:
			case MovementType.TO:
			default:
				return this.movement.to;
		}
	}

	shouldSelectNewToPoint() {
		const toPoint = this.getToPoint();
		return (
			Motion.hasReachedPoint(this.position, toPoint, 30) ||
			this.isOutOfBounds() ||
			Random.odds(0.001)
		);
	}

	selectNewToPoint() {
		this.movement = {
			movementType: getRandomMovementType(),
			to: this.visual.getRandomInboundsPoint(),
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			following: this.visual.getRandomMember()!
		};
	}

  shouldFleeMouse() {
    return this.movement.movementType !== MovementType.MOUSE_FLEE
      && Motion.hasReachedPoint(this.position, this.visual.getUserPosition().mousePos, 56);
  }

  selectPointAwayFromMouse() {
		this.movement.movementType = MovementType.MOUSE_FLEE;
    this.movement.to = Motion.getPointInDirection(this.position, this.rotation + Math.PI, 100);
  }

	move() {
		if (this.shouldSelectNewToPoint()) {
			this.selectNewToPoint();
		}
    // else if (this.shouldFleeMouse()) {
    //   this.selectPointAwayFromMouse();
    // }
		const toPoint = this.getToPoint();
		const angleTo = Geometry.getAngleTo(this.position, toPoint);
		this.rotation = Motion.rotateTowardsAngleAtSpeed(
			this.rotation,
			angleTo,
			this.rotationalSpeed
		);
		this.position = Motion.moveAtAngle(this.position, this.rotation, this.speed);
	}

	draw() {
		Canvas.draw(
      this.visual.getContext(),
      getArrowDrawingInstructions(this.position, this.rotation, this.getColor())
    );
	}

  drawLineToToPoint() {
    const to = this.getToPoint();
		if (to) {
      Canvas.draw(
        this.visual.getContext(),
        {
          position: this.position,
          layers: [
            {
              id: 'line',
              strokes: [
                ['moveTo', this.position.x, this.position.y],
                ['lineTo', to.x, to.y],
              ],
              strokeStyle: this.getMotionColor() + "4"
            }
          ]
        }
      )
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

	getTailPoint(): Point {
		const { x, y } = this.position;
		return {
			x: x + Math.sin(this.rotation) * MEMBER.LENGTH,
			y: y + Math.cos(this.rotation) * MEMBER.LENGTH
		};
	}

	getMotionColor() {
		switch (this.movement.movementType) {
			case MovementType.MOUSE_TO:
				return Color.toString({ r: 0, g: 0, b: 0, a:  1 -  Geometry.distance(this.position, this.visual.getUserPosition().mousePos) / this.visual.getSize().diagonalLength });
			case MovementType.FOLLOWING:
				return Color.toString({ r: 0, g: 0, b: 255, a: 1 - Geometry.distance(this.position, this.movement.following.getTailPoint()) / this.visual.getSize().diagonalLength });
			case MovementType.TO:
			default:
				return Color.toString({ r: 255, g: 0, b: 0, a: 1 - Geometry.distance(this.position, this.movement.to) / this.visual.getSize().diagonalLength });
		}
	}

	isOutOfBounds(): boolean {
		const { W, H } = this.visual.getSize();
		const { x, y } = this.position;
		return !(x > 0 && x < W && y > 0 && y < H);
	}
}
