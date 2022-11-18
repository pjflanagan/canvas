import { Color, Geometry, Random, type IColor, type Point, type Point3D } from "$lib/util";
import { WORLD, type FireflyVisual } from "./FireflyVisual";

// TODO: remove 3D movement in favor of layers

const BUG = {
	VELOCITY_MIN: .2,
	VELOCITY_MAX: .8,
	BLINK_TIMEOUT_MIN: 600,
	BLINK_TIMEOUT_MAX: 2000,
	BLINK_DURATION_MIN: 80,
	BLINK_DURATION_MAX: 120,
	BIG_CHANCE: 0.96,
}

export class Bug {
  visual: FireflyVisual;
  ctx: CanvasRenderingContext2D;
  i: number;
  pos: Point3D;
  to!: Point3D;
  on: boolean;
  nextBlinkTime!: number;
  aXY!: number;
  aZ!: number;
  v!: number;
  color: {
    body: string;
    glow: string;
  }

	constructor(visual: FireflyVisual, i: number) {
		this.visual = visual;
		this.ctx = this.visual.getContext();
		this.i = i;

		this.pos = this.visual.getRandomCoords();
		this.chooseNewPoint();

    this.on = Random.odds(.2);
    this.color = {
      body: '',
      glow: ''
    };
		this.blink(Date.now());
	}

	setNextBlinkTime(date: number) {
		const zScale = this.zScale();
		if (this.on) {
			if (zScale > BUG.BIG_CHANCE) {
				this.nextBlinkTime = date + Random.float(BUG.BLINK_DURATION_MIN * 3, BUG.BLINK_DURATION_MAX * 4);

			} else {
				this.nextBlinkTime = date + Random.float(BUG.BLINK_DURATION_MIN, BUG.BLINK_DURATION_MAX);
			}
		} else {
			this.nextBlinkTime = date + Random.float(BUG.BLINK_TIMEOUT_MIN, BUG.BLINK_TIMEOUT_MAX);
		}
	}

	blink(date: number) {
		this.on = !this.on;
    this.setNextBlinkTime(date);
    this.setColor();
	}

	isCloseToEdge() {
		return this.visual.isCloseToEdge(this.pos);
	}

	move(date: number) {
		if (this.isCloseToPoint()) {
			this.chooseNewPoint();
		} else if (this.isCloseToEdge()) {
			this.pos = this.visual.getRandomCoords();
			this.chooseNewPoint();
		}

		if (date > this.nextBlinkTime) {
			this.blink(date);
		}

		const vx = Math.cos(this.aXY) * this.v;
		const vy = Math.sin(this.aXY) * this.v;
		const vz = Math.cos(this.aZ) * this.v;

		this.pos = {
			x: this.pos.x - vx,
			y: this.pos.y - vy,
			z: this.pos.z - vz
		}
	}

	draw() {
		const zScale = this.zScale();
		const radius = (zScale > BUG.BIG_CHANCE) ? 2 : 1.2 * zScale;
		this.ctx.beginPath();
		this.ctx.moveTo(this.pos.x, this.pos.y);
		this.ctx.arc(this.pos.x, this.pos.y, radius, 0, Math.PI * 2, false);
		this.ctx.fillStyle = this.color.body;
		this.ctx.fill();
		this.ctx.closePath();
		if (this.on && zScale > BUG.BIG_CHANCE) {
			const glowRadius = 6 + (zScale - BUG.BIG_CHANCE) * 10;
			this.ctx.beginPath();
			this.ctx.moveTo(this.pos.x, this.pos.y);
			this.ctx.arc(this.pos.x, this.pos.y, glowRadius, 0, Math.PI * 2, false);
			this.ctx.fillStyle = this.color.glow;
			this.ctx.fill();
			this.ctx.closePath();
		}
  }
  
  zScale() {
    return this.visual.zScale(this.pos.z);
  }

	setColor() {
		if (this.on) {
      this.color.body = `rgb(255, 255, ${ 255 * Random.float(.4, 1) })`;
      this.color.glow = `rgba(254, 255, 207, ${Random.float(0.02, 0.08)})`;
		} else {
      this.color.body = `rgba(0, 0, 0, ${this.zScale()})`;
      this.color.glow = '#0000';
    }
	}

	isCloseToPoint() {
		return Geometry.distance3D(this.pos, this.to) < WORLD.CLOSE_TO_POINT_DISTANCE;
	}

	chooseNewPoint() {
    // TODO: make this get random coords at the layer of the trees
    // with maybe a few that escape to the top
		this.to = this.visual.getRandomCoords();
		const { aXY, aZ } = this.getAngleTo();
		this.aXY = aXY;
		this.aZ = aZ;
		this.v = Random.float(BUG.VELOCITY_MIN, BUG.VELOCITY_MAX);
	}

	getAngleTo() {
		const to = this.to;
		const pos = this.pos;
		const dx = pos.x - to.x,
			dy = pos.y - to.y,
			dz = pos.z - to.z;
		return {
			aXY: -1.0 * Math.atan2(dx, dy) + Math.PI / 2,
			aZ: 1.0 * Math.atan2(dx, dz) + Math.PI / 2
		};
	}
}
