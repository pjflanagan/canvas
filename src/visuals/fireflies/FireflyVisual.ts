

import { Geometry, Random, type Point, type Point3D } from "$lib/util";
import { Visual } from "$lib/visual";
import { Bug } from "./Bug";

export const FIREFLY_VISUAL = {
	BUGS_PER_LAYER: 200,
	LAYER_COUNT: 10,
	CLOSE_TO_POINT_DISTANCE: 20,
	NEXT_POINT_DISTANCE: 100,
	COLOR: [
		"#000000BB",
		"#0F001aBB",
		"#11011FBB",
		"#02092eBB",
		"#032130BB",
		"#000000"
  ],
  COLOR_INIT_LOCATIONS: [
    0,
    .1,
    .2,
    .3,
    .5,
    .5
  ],
  HILLS: [
    { x: .5, y: -.1, xr: .3, yr: .15, color: "#000B" },
    { x: .2, y: 0, xr: .3, yr: .1, color: "#000" },
    { x: .8, y: 0, xr: .35, yr: .1, color: "#000" }
  ]
}

export class FireflyVisual extends Visual {
  static visualName = 'Fire Files';
  static visualLink = 'fireflies';
  layers: Bug[];
  Wp100: number;
  Hp100: number;
  HALF_H: number;
  max: number;
  grd!: CanvasGradient;
  color!: number[];
  toColor!: number[];

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
	}

  setup() {
		this.initBackground();
    this.initLayers();
  }

  drawFrame() {
		this.drawBackground();
		this.drawLayers();
  }

	// helpers

	initBackground() {
		this.color = FIREFLY_VISUAL.COLOR_INIT_LOCATIONS;
		this.toColor = [];
		for (let i = 1; i < this.color.length - 2; ++i) {
			this.toColor[i - 1] = this.color[i];
		}
		this.setGradient();
	}

	setGradient() {
		this.grd = this.ctx.createLinearGradient(0, 0, 0, this.H);
		for (let i = 0; i < this.color.length; ++i) {
			this.grd.addColorStop(this.color[i], FIREFLY_VISUAL.COLOR[i]);
		}
	}

	initLayers() {
    // TODO: push some layers of trees
		for (let i = 0; i < FIREFLY_VISUAL.LAYER_COUNT; i++) {
			for(let j = 0; j < FIREFLY_VISUAL.BUGS_PER_LAYER; j++) {
				this.layers.push(new Bug(this, i));
			}
		}
	}

	drawBackground() {
    // TODO: make this better than just some hills
    // make it like a mountain or something
		this.ctx.rect(0, 0, this.W, this.H);
		this.ctx.fillStyle = this.grd;
    this.ctx.fill();
    
    for(let i = 0; i < FIREFLY_VISUAL.HILLS.length; ++i) {
      const { x, y, xr, yr, color } = FIREFLY_VISUAL.HILLS[i]
      this.ctx.beginPath();
      this.ctx.moveTo(100, this.HALF_H);
      this.ctx.ellipse(
        this.W * x,
        this.HALF_H - this.HALF_H * y,
        this.W * xr,
        this.H * yr,
        0,
        0,
        Math.PI * 2,
        false
      );
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.closePath();
    }
	}

	drawLayers() {
		this.layers.forEach((l) => {
			l.draw();
			l.move(Date.now());
		});
	}

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

