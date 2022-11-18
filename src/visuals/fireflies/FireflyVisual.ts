

import { Geometry, Random, type Point3D } from "$lib/util";
import { Visual } from "$lib/visual";
import { Bug } from "./Bug";

export const WORLD = {
	BUG_COUNT: 2000,
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
  bugs: Bug[];
  D: number;
  Wp100: number;
  Hp100: number;
  Dp100: number;
  HALF_H: number;
  max: number;
  grd!: CanvasGradient;
  color!: number[];
  toColor!: number[];

	constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);

		this.D = (this.W + this.H) / 2;
		this.Wp100 = this.W + 100;
		this.Hp100 = this.H + 100;
    this.Dp100 = this.D + 100;
    this.HALF_H = this.H / 2;
		this.bugs = [];
		this.max = Geometry.distance3D(
      { x: this.W, y: this.H, z: this.D },
      { x: 0, y: 0, z: 0 }
    );
	}

  setup() {
		this.initBackground();
    this.initLayers();
  }

  drawFrame() {
		this.drawBackground();
		this.drawBugs();
  }

	initBackground() {
		this.color = WORLD.COLOR_INIT_LOCATIONS;
		this.toColor = [];
		for (let i = 1; i < this.color.length - 2; ++i) {
			this.toColor[i - 1] = this.color[i];
		}
		this.setGradient();
	}

	setGradient() {
		this.grd = this.ctx.createLinearGradient(0, 0, 0, this.H);
		for (let i = 0; i < this.color.length; ++i) {
			this.grd.addColorStop(this.color[i], WORLD.COLOR[i]);
		}
	}

	initLayers() {
    // TODO: push some layers of trees
		for (let i = 0; i < WORLD.BUG_COUNT; i++) {
			this.bugs.push(new Bug(this, i));
		}
	}

	drawBackground() {
    // TODO: make this better than just some hills
    // make it like a mountain or something
		this.ctx.rect(0, 0, this.W, this.H);
		this.ctx.fillStyle = this.grd;
    this.ctx.fill();
    
    for(let i = 0; i < WORLD.HILLS.length; ++i) {
      const { x, y, xr, yr, color } = WORLD.HILLS[i]
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

	drawBugs() {
		for (let i = WORLD.BUG_COUNT - 1; i >= 0; i--) {
			const bug = this.bugs[i];
			bug.draw();
			bug.move(Date.now());
		}
	}

	getRandomCoords() {
		return {
			x: Random.number(-100, this.Wp100),
			y: Random.number(-100, this.Hp100),
			z: Random.number(-100, this.Dp100)
		};
	}

	isCloseToEdge({ x, y, z }: Point3D) {
		return (
			x < -100 || x > this.Wp100 ||
			y < -100 || y > this.Hp100 ||
			z < -100 || z > this.Dp100
		)
	}

	zScale(z: number) {
		return (.5 * (z / this.D)) + .5;
	}
}

