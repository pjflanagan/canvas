
// CONST -------------------------------------------------------------------------------------------

import { Random, type Point } from "$lib/util";
import { Visual } from "$lib/visual";
import { noop } from "lodash";

const WORLD = {
	MAX_BAMBOO: 2000,
	INIT_BAMBOO_COUNT: 12,
	BACKGROUND_COLOR: '#33a853'
}

const BAMBOO = {
	WIDTH: 20,
	SEGMENT_HEIGHT: 60,
	SEGMENT_GAP: 2,
	STROKE_COLOR: '#23833d66'
}

// BambooVisual -------------------------------------------------------------------------------------------

export class BambooVisual extends Visual {
  static visualName = 'Bamboo';
  static visualLink = 'bamboo';
  bamboo: Bamboo[];
  maxSegments: number;

	constructor(context: CanvasRenderingContext2D) {
    super(context);

		this.bamboo = [];
		this.maxSegments = Math.floor(this.H / BAMBOO.SEGMENT_HEIGHT) - 5;
	}

	setup() {
		this.drawBackground();
		this.initBamboo();
	}

	start() {
		this.drawBamboo(0);
	}

	initBamboo() {
		let x = BAMBOO.WIDTH;
		while (x < this.W) {
			this.bamboo.push(new Bamboo(this, x));
			x += BAMBOO.WIDTH * 2 + Random.number(-4, 4);
		}
		this.bamboo.sort(() => Math.random() - 0.5);
	}

	drawFrame(): void {
			noop();
	}

	drawBackground() {
		this.ctx.rect(0, 0, this.W, this.H);
		this.ctx.fillStyle = WORLD.BACKGROUND_COLOR;
		this.ctx.fill();
	}

	draw3Bamboo(i: number) {
		for (let j = 0; j < 3; ++j) {
			if (i === this.bamboo.length) {
				return i;
			}
			this.bamboo[i].draw();
			++i;
		}
		return i;
	}

	drawBamboo(i: number) {
		if (i === this.bamboo.length) {
			return;
		}

		i = this.draw3Bamboo(i);

		setTimeout(() => {
			this.drawBamboo(i);
		}, 60);
	}
}

// BAMBOO ------------------------------------------------------------------------------------------

type Segment = Point[];

class Bamboo {
  world: BambooVisual;
  ctx: CanvasRenderingContext2D;
  base: Point;
  segments: Segment[];

	constructor(world: BambooVisual, x: number) {
		this.world = world;
		this.ctx = world.getContext();

		// set a base
		this.base = {
			x,
			y: this.world.getSize().H + Math.random() * .8 * BAMBOO.SEGMENT_HEIGHT
		};

		// add one segment to start
		this.segments = [];
		this.segments.push(this.makeSegment(this.base));
		this.grow();

		// this.leaves = [];
		// this.segments.forEach(segment => {
		//   const leaf = this.makeLeaf(segment.p4);
		//   this.leaves.push(leaf);
		// })
	}

	grow() {
		const maxSegments = this.world.maxSegments + Random.number(-3, 3);
		const dir = Random.boolean()
		for (let i = 0; i < maxSegments; ++i) {
			const lastSegment = this.segments[this.segments.length - 1];
			this.segments.push(this.makeSegment(lastSegment[3], dir));
		}
	}

	makeSegment({ x, y }: Point, dir = false): Segment {
		y = y - BAMBOO.SEGMENT_GAP;
		let nextX = x + Random.number(-2, 0);
		if (dir) {
			nextX = x + Random.number(0, 2);
		}
		return [
			{ x, y },
			{ x: x + Random.number(-3, 3), y: y - Random.number(16, 24) },
			{ x: x + Random.number(-3, 3), y: y - 20 - Random.number(16, 24) },
			{ x: nextX, y: y - 40 - Random.number(14, 28) }, // BAMBOO.SEGMENT_HEIGHT
    ]
	}

	draw() {
		this.drawSegment(0);
	}

	drawSegment(i: number) {
		if (i === this.segments.length - 1) {
			return;
		}

		const [p1, p2, p3, p4] = this.segments[i];
		this.ctx.beginPath();
		this.ctx.moveTo(p1.x, p1.y);
		this.ctx.bezierCurveTo(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
		this.ctx.strokeStyle = BAMBOO.STROKE_COLOR;
		this.ctx.lineWidth = BAMBOO.WIDTH;
		this.ctx.stroke();

		setTimeout(() => {
			this.drawSegment(++i);
		}, 30);
	}
}
