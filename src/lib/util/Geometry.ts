export type Point = {
	x: number;
	y: number;
};

export const ZERO_POINT = { x: 0, y: 0 };

type CircleIntersectionParams = {
	ellipseRadiusX: number;
	ellipseRadiusY: number;
	circleRadius: number;
};

type CircleIntersectionPoint = Point & {
	phi: number;
	theta: number;
};

export class Geometry {
	static distance(a: Point, b: Point) {
		return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	}

	// Get's the 4 intersection points of a concentric ellipse and circle
	// phi, idk what this represents anymore, but it's used to calculate theta
	// theta is the angle that x and y are at to the center
	static ellipseCircleIntersection({
		ellipseRadiusX,
		ellipseRadiusY,
		circleRadius
	}: CircleIntersectionParams): CircleIntersectionPoint[] {
		// https://www.analyzemath.com/EllipseProblems/ellipse_intersection.html
		const num = ellipseRadiusX * ellipseRadiusX - circleRadius * circleRadius;
		const denom = (ellipseRadiusX * ellipseRadiusX) / (ellipseRadiusY * ellipseRadiusY) - 1;
		const y = Math.sqrt(num / denom);
		const x = Math.sqrt(circleRadius * circleRadius - y * y);
		const values: CircleIntersectionPoint[] = [
			{ x, y, phi: Math.atan2(y, x), theta: -1 },
			{ x: -x, y, phi: Math.atan2(y, -x), theta: -1 },
			{ x, y: -y, phi: Math.atan2(-y, x), theta: -1 },
			{ x: -x, y: -y, phi: Math.atan2(-y, -x), theta: -1 }
		];

		// https://www.petercollingridge.co.uk/tutorials/computational-geometry/finding-angle-around-ellipse/
		values.forEach((v) => {
			v.theta = Math.atan((ellipseRadiusX / ellipseRadiusY) * Math.tan(v.phi));
		});

		return values;
	}

	static getAngleTo(sourcePoint: Point, targetPoint: Point): number {
		return Math.atan2(targetPoint.x - sourcePoint.x, targetPoint.y - sourcePoint.y);
	}

	// returns the signed delta angle between two angles
	static getDeltaAngle(sourceAngle: number, targetAngle: number): number {
		return Math.atan2(Math.sin(targetAngle - sourceAngle), Math.cos(targetAngle - sourceAngle));
	}

	static degToRad(deg: number): number {
		return deg * (Math.PI / 180);
	}
}
