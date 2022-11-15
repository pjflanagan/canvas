import { type Point, distance } from './Geometry';

export class Motion {
	static hasReachedPoint(a: Point, b: Point, threshold: number): boolean {
		return distance(a, b) < threshold;
	}

	static moveInDirection(cur: Point, to: Point, speed: number): Point {
		const a = Math.atan2(to.y - cur.y, to.x - cur.x);
		return {
			x: cur.x + speed * Math.cos(a),
			y: cur.y + speed * Math.sin(a)
		};
	}
}
