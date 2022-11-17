import { type Point, Geometry } from './Geometry';

export class Motion {
	static hasReachedPoint(sourcePoint: Point, targetPoint: Point, threshold: number): boolean {
		return Geometry.distance(sourcePoint, targetPoint) < threshold;
	}

	static getPointInDirection(cur: Point, angle: number, radius: number): Point {
		return {
			x: cur.x + Math.sin(angle) * radius,
			y: cur.y + Math.cos(angle) * radius
		}
	}

	// returns a new position in the direction of a point
	// if the point is closer than the speed, it returns the original point
	static moveTowardsPoint(cur: Point, to: Point, speed: number): Point {
		if (Motion.hasReachedPoint(cur, to, speed)) {
			return cur;
		}
		const angle = Math.atan2(to.y - cur.y, to.x - cur.x);
		return Motion.moveAtAngle(cur, angle, speed);
	}

	// returns a new position in the direction of an angle
	static moveAtAngle(pos: Point, angle: number, speed: number): Point {
		return {
			x: pos.x + Math.sin(angle) * -speed,
			y: pos.y + Math.cos(angle) * -speed
		};
	}

	// returns the new angle source should be rotated at
	// if the delta is less than the rotation speed, it does not change the angle
	static rotateTowardsAngleAtSpeed(
		sourceAngle: number,
		targetAngle: number,
		rotationSpeed: number
	): number {
		const deltaAngle = Geometry.getDeltaAngle(sourceAngle, targetAngle);
		if (Math.abs(deltaAngle) < Math.abs(rotationSpeed)) {
			return sourceAngle;
		}
		return sourceAngle - Math.sign(deltaAngle) * rotationSpeed;
	}
}
