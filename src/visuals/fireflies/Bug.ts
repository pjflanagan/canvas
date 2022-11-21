import { Geometry, Motion, Random, type Point } from '$lib/util';
import { FIREFLY_VISUAL, type FireflyVisual } from './FireflyVisual';

const BUG = {
  VELOCITY_MIN: 0.2,
  VELOCITY_MAX: 0.8,
  BLINK_TIMEOUT_MIN: 600,
  BLINK_TIMEOUT_MAX: 2000,
  BLINK_DURATION_MIN: 80,
  BLINK_DURATION_MAX: 120,
  BIG_CHANCE: 0.96,
};

export class Bug {
  visual: FireflyVisual;
  ctx: CanvasRenderingContext2D;
  layer: number;
  pos: Point;
  to!: Point;
  on: boolean;
  nextBlinkTime!: number;
  aXY!: number;
  v!: number;
  color: {
    body: string;
    glow: string;
  };

  constructor(visual: FireflyVisual, layer: number) {
    this.visual = visual;
    this.ctx = this.visual.getContext();
    this.layer = layer;

    this.pos = this.visual.getRandomCoords();
    this.chooseNewPoint();

    this.on = Random.odds(0.2);
    this.color = {
      body: '',
      glow: '',
    };
    this.blink(Date.now());
  }

  setNextBlinkTime(date: number) {
    const zScale = this.zScale();
    if (this.on) {
      if (zScale > BUG.BIG_CHANCE) {
        this.nextBlinkTime =
          date + Random.float(BUG.BLINK_DURATION_MIN * 3, BUG.BLINK_DURATION_MAX * 4);
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
      // just teleport them inbounds
      this.pos = this.visual.getRandomCoords();
      this.chooseNewPoint();
    }

    if (date > this.nextBlinkTime) {
      this.blink(date);
    }

    this.pos = Motion.moveAtAngle(this.pos, this.aXY, this.v);
  }

  draw() {
    const zScale = this.zScale();
    const radius = zScale > BUG.BIG_CHANCE ? 2 : 1.2 * zScale;
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

  setColor() {
    if (this.on) {
      this.color.body = `rgb(255, 255, ${255 * Random.float(0.4, 1)})`;
      this.color.glow = `rgba(254, 255, 207, ${Random.float(0.02, 0.08)})`;
    } else {
      this.color.body = `rgba(0, 0, 0, ${this.zScale()})`;
      this.color.glow = '#0000';
    }
  }

  zScale() {
    return (1.2 * this.layer) / FIREFLY_VISUAL.LAYER_COUNT;
  }

  isCloseToPoint() {
    return Geometry.distance(this.pos, this.to) < FIREFLY_VISUAL.CLOSE_TO_POINT_DISTANCE;
  }

  chooseNewPoint() {
    // v2: make this get random coords at the layer of the trees
    // with maybe a few that escape to the top
    this.to = this.visual.getRandomCoords();
    this.aXY = Geometry.getAngleTo(this.pos, this.to);
    this.v = Random.float(BUG.VELOCITY_MIN, BUG.VELOCITY_MAX);
  }
}
