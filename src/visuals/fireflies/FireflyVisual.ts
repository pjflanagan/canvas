

import { Canvas } from "$lib/canvas";
import { Geometry, Random, type Point } from "$lib/util";
import { Visual } from "$lib/visual";
import { Bug } from "./Bug";
import { Mountain } from "./Mountains";
// import { Tree } from "./Tree";

export const FIREFLY_VISUAL = {
	BUGS_PER_LAYER: 200,
	TREES_PER_LAYER: 3,
	LAYER_COUNT: 10,
	CLOSE_TO_POINT_DISTANCE: 20,
	NEXT_POINT_DISTANCE: 100,
}

export class FireflyVisual extends Visual {
  static visualName = 'Fire Files';
  static visualLink = 'fireflies';
  layers: (Bug | Mountain)[];
  Wp100: number;
  Hp100: number;
  HALF_H: number;
  max: number;
  grd!: CanvasGradient;
  color!: number[];
  toColor!: number[];
	gradient: CanvasGradient;

	constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);

		this.Wp100 = this.W + 100;
		this.Hp100 = this.H + 100;
    this.HALF_H = this.H / 2;
		this.layers = [];
		this.max = Geometry.distance(
      { x: this.W, y: this.H },
      { x: 0, y: 0 }
    );

		this.gradient = Canvas.createLinearGradient(this.ctx, {
			size: [0, 0, 0, this.H],
			colorStops: [
				[0, '#070114'],
				[0.5, '#060a28'],
				[1, '#011429'],
				// [0, '#272134'],
				// [0.5, '#262a48'],
				// [1, '#213449'],
			]
		})
	}

  setup() {
    this.initLayers();
  }

  drawFrame() {
		this.drawBackground();
		this.drawLayers();
  }

	// setup

	initLayers() {
		for(let i = 0; i < 8; i++) {
			this.layers.push(new Mountain(this));
		}
		for (let i = 0; i < FIREFLY_VISUAL.LAYER_COUNT; i++) {
			for (let j = 0; j < FIREFLY_VISUAL.BUGS_PER_LAYER; j++) {
				this.layers.push(new Bug(this, i));
			}
			// for (let j = 0; j < FIREFLY_VISUAL.TREES_PER_LAYER; j++) {
			// 	this.layers.push(new Tree(this));
			// }
		}
	}

	// draw

	drawBackground() {
		Canvas.draw(this.ctx, {
			layers: [
				{
					id: 'background',
					strokes: [
						['rect', 0, 0, this.W, this.H]
					],
					fillStyle: this.gradient
				}
			]
		})
	}

	drawLayers() {
		this.layers.forEach((l) => {
			l.draw();
			l.move(Date.now());
		});
	}

	// helpers

	getRandomCoords() {
		return {
			x: Random.number(-100, this.Wp100),
			y: Random.number(-100, this.Hp100),
		};
	}

	isCloseToEdge({ x, y }: Point) {
		return (
			x < -100 || x > this.Wp100 ||
			y < -100 || y > this.Hp100
		)
	}
}

