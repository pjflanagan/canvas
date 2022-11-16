import type { Point } from "./Geometry";

export class LinearFormula {
	m: number;
	b: number;

	constructor(min: Point, max: Point) {
		this.m = (max.y - min.y) / (max.x - min.x);
		this.b = min.y - this.m * min.x;
	}

	calc(x: number) {
		return this.m * x + this.b;
	}
}

export class QuadraticFormula {
	vertex: Point;
	a: number;

	constructor(point: Point, vertex: Point) {
		this.vertex = vertex;
		this.a = point.y - vertex.y / Math.pow(point.x - vertex.x, 2);
	}

	calc(x: number) {
		const { a, vertex } = this;
		return a * Math.pow(x - vertex.x, 2) + vertex.y;
	}
}
