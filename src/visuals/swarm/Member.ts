import { Canvas } from '$lib/canvas';
import { Color, Geometry, Motion, Random, type Point } from '$lib/util';
import type { SwarmVisual } from './SwarmVisual';

// TODO: these should either be birds, or fish
// I'm sure I could make a decent looking fish

const MEMBER = {
	LENGTH: 26,
	ANGLE: 0.25,
	ROTATIONAL_SPEED: 0.04,
	MAX_SPEED: 4
};

enum MovementType {
	TO,
	FOLLOWING,
	MOUSE
}
export class Member {
	visual: SwarmVisual;
	movement: {
		movementType: MovementType;
		to: Point;
		following: Member;
	};
	position: Point;
	rotation: number;
	angularVelocity: number;
	color: string;

	constructor(visual: SwarmVisual) {
		this.visual = visual;
		this.movement = {
			movementType: MovementType.TO,
			to: this.visual.getRandomInboundsPoint(),
			following: this // placeholder
		};
		this.position = this.visual.getRandomInboundsPoint();
		this.rotation = Random.float(-Math.PI, Math.PI);
		this.angularVelocity = 0.08;
		this.color = Color.toString(Color.getRandomColor());
	}

	getToPoint(): Point {
		switch (this.movement.movementType) {
			case MovementType.MOUSE:
				return this.visual.getUserPosition().mousePos;
			case MovementType.FOLLOWING:
				return this.movement.following.getTailPoint();
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

	getRandomMovementType(): MovementType {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return Random.arrayItem([MovementType.TO, MovementType.MOUSE, MovementType.FOLLOWING])!;
	}

	selectNewToPoint() {
		this.movement = {
			movementType: this.getRandomMovementType(),
			to: this.visual.getRandomInboundsPoint(),
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			following: this.visual.getRandomMember()!
		};
	}

	move() {
		if (this.shouldSelectNewToPoint()) {
			this.selectNewToPoint();
		}
		const toPoint = this.getToPoint();
		const angleTo = Geometry.getAngleTo(this.position, toPoint);
		this.rotation = Motion.rotateTowardsAngleAtSpeed(
			this.rotation,
			angleTo,
			MEMBER.ROTATIONAL_SPEED
		);
		this.position = Motion.moveAtAngle(this.position, this.rotation, MEMBER.MAX_SPEED);
	}

	draw() {
		Canvas.draw(this.visual.getContext(), {
			position: this.position,
			layers: [
				{
					id: 'bird-pointer',
					strokes: [
						['moveTo', 0, 0],
						[
							'lineTo',
							Math.sin(this.rotation - MEMBER.ANGLE) * MEMBER.LENGTH,
							Math.cos(this.rotation - MEMBER.ANGLE) * MEMBER.LENGTH
						],
						[
							'lineTo',
							Math.sin(this.rotation + MEMBER.ANGLE) * MEMBER.LENGTH,
							Math.cos(this.rotation + MEMBER.ANGLE) * MEMBER.LENGTH
						]
					],
					fillStyle: this.getColor(),
					rotation: this.rotation
				}
			]
		});

		// const to = this.getToPoint();
		// if (to) {
		//   this.visual.getContext().beginPath();
		//   this.visual.getContext().moveTo(this.position.x, this.position.y);
		//   this.visual.getContext().lineTo(to.x, to.y);
		//   this.visual.getContext().strokeStyle = this.getMotionColor() + "4";
		//   this.visual.getContext().stroke();
		// }
	}

	getColor() {
		switch (this.movement.movementType) {
			case MovementType.MOUSE:
				return '#000';
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
			case MovementType.MOUSE:
				return '#000';
			case MovementType.FOLLOWING:
				return '#00F';
			case MovementType.TO:
			default:
				return '#F00';
		}
	}

	isOutOfBounds(): boolean {
		const { W, H } = this.visual.getSize();
		const { x, y } = this.position;
		return !(x > 0 && x < W && y > 0 && y < H);
	}
}
