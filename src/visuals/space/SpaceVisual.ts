import { Visual } from '$lib/visual';
import { distance, Random } from '$lib/util';
import type { Body } from './Body';
import { Star } from './Star';
import { Moon } from './Moon';
import { Ship } from './Ship';
import { Planet } from './Planet';
import { Canvas } from '$lib/canvas';

const CANVAS = {
	STARS: { min: 84, max: 164 },
	BACKGROUND_MOONS: { min: 2, max: 7 },
	FOREGROUND_MOONS: { min: 3, max: 5 },
	SCROLL_HEIGHT_MULTIPLIER: 3
};

export class SpaceVisual extends Visual {
	bodies: Body[];
	angle: number;
	strength: number;
	scrollPercent: number;

	constructor(context: CanvasRenderingContext2D) {
		super(context);

		this.bodies = [];
		this.angle = 0;
		this.strength = 0;
		this.scrollPercent = 0;
		this.maxScrollHeight = CANVAS.SCROLL_HEIGHT_MULTIPLIER * this.H;
	}

	setup() {
		// add things to bodies in order from bottom to top
		const starCount = Random.prop(CANVAS.STARS);
		for (let i = 0; i < starCount; ++i) {
			this.bodies.push(new Star(this, 0, i));
		}

		const starCount2 = Random.prop(CANVAS.STARS);
		for (let i = 0; i < starCount2; ++i) {
			this.bodies.push(new Star(this, 1, i));
		}

		const bgMoonCount = Random.prop(CANVAS.BACKGROUND_MOONS);
		for (let i = 0; i < bgMoonCount; ++i) {
			this.bodies.push(new Moon(this, 2, i));
		}

		const bgMoonCount2 = Random.prop(CANVAS.BACKGROUND_MOONS);
		for (let i = 0; i < bgMoonCount2; ++i) {
			this.bodies.push(new Moon(this, 3, i));
		}

		this.bodies.push(new Planet(this, 4, 0));
		this.bodies.push(new Ship(this, 5, 0)); // TODO: SET LAYERS AS NAMES SHIP_LAYER

		const fgMoonCount = Random.prop(CANVAS.FOREGROUND_MOONS);
		for (let i = 0; i < fgMoonCount; ++i) {
			this.bodies.push(new Moon(this, 6, i));
		}

		const fgMoonCount2 = Random.prop(CANVAS.FOREGROUND_MOONS);
		for (let i = 0; i < fgMoonCount2; ++i) {
			this.bodies.push(new Moon(this, 7, i));
		}

		const starCount3 = Random.prop(CANVAS.STARS);
		for (let i = 0; i < starCount3; ++i) {
			this.bodies.push(new Star(this, 8, i));
		}
	}

	drawFrame() {
		const center = {
			x: this.W / 2,
			y: this.H / 2
		};
		this.angle = Math.atan2(this.mousePos.y - center.y, this.mousePos.x - center.x);
		this.strength = distance(center, this.mousePos) / (this.diagonalLength / 2);
		this.scrollPercent = Math.min(this.scrollY / (this.H * CANVAS.SCROLL_HEIGHT_MULTIPLIER), 1);

		this.drawBackground();
		this.bodies.forEach((body) => {
			body.move();
			body.draw();
		});
	}

	drawBackground() {
		Canvas.draw(this.ctx, {
			layers: [
				{
					id: 'background',
					strokes: [['rect', 0, 0, this.W, this.H]],
					fillStyle: '#1c1c1c'
				}
			]
		});
	}
}
