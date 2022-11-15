import { distance, Random, type Point, ZERO_POINT, Color, Motion } from "$lib/util";
import type { SpaceVisual } from "./SpaceVisual";

const BODY = {
  COLOR: {
    ANGULAR_VELOCITY: { min: 0.001, max: 0.003 },
    RESIZE_FREQUENCY: { min: 0.1, max: 0.3 },
    DISTANCE_FROM_CENTER: { min: 1 / 4, max: 1 / 3 },
    OVERLAY_OPACITY_INSIDE: 0.2,
    OVERLAY_OPACITY_OUTSIDE: 0.8,
  },
  TRAIL: {
    OPACITY_OUTSIDE: 0.08,
    OPACITY_INSIDE: 0.01,
    COLOR_STOP: 0.25,
  },
};

export type PointTo = Point & {
  to: Point;
}

export class Body {
  visual: SpaceVisual;
  ctx: CanvasRenderingContext2D;
  id: string;
  layer: number;
  prop: any;
  state: {
    [key: string]: any;
    pos: Point;
    offset: PointTo; // tbh, it's kinda messy to have offset contain the to point
  };

  constructor(visual: SpaceVisual, layer: number, id: number) {
    // general info
    this.visual = visual;
    this.ctx = this.visual.ctx;
    this.id = `${layer}-${id}`;
    this.layer = layer;

    // variables
    this.state = { pos: ZERO_POINT, offset: { ...ZERO_POINT, to: ZERO_POINT } }
    this.prop = {};

    // run the setup function defined in the child class
    this.setup();
    this.setOffsetTo();

    this.prop.layerStrength =
      Random.float(0.9, 1.1) * (18 / (0.1 * layer + 0.8) + 4);
    this.state.pos = { x: this.prop.center.x, y: this.prop.center.y };
  }

  setup() {
    throw 'Method needs to be implemented by child of Body.';
  }

  move() {
    throw 'Method needs to be implemented by child of Body.';
  }

  draw() {
    throw 'Method needs to be implemented by child of Body.';
  }

  setupColors() {
    const dir = Random.boolean() ? 1 : -1;
    this.prop.colorProp = {
      angularVelocity: dir * Random.prop(BODY.COLOR.ANGULAR_VELOCITY),
      resizeFrequency: Random.prop(BODY.COLOR.RESIZE_FREQUENCY),
    };
    // color is relative to the actual center
    this.state.colorPos = {
      angle: Random.float(-Math.PI, Math.PI),
      distanceFromCenter: Random.prop(
        BODY.COLOR.DISTANCE_FROM_CENTER,
        this.prop.radius
      ),
    };
  }

  setOffsetTo() {
    const angle = Random.float(-Math.PI, Math.PI);
    const radius = Random.float(0, this.prop.offsetRadiusMax);
    this.state.offset.to = {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    };
  }

  hasReachedOffset() {
    const { offset } = this.state;
    return Motion.hasReachedPoint(offset, offset.to, 4);
  }

  getMouseShiftedCenter() {
    const { angle, strength } = this.visual;
    const { center, layerStrength } = this.prop;
    return {
      x: center.x + layerStrength * strength * Math.cos(angle),
      y: center.y + layerStrength * strength * Math.sin(angle),
    };
  }

  getScrollShiftedCenter() {
    const { scrollPercent } = this.visual;
    const { layerStrength, scrollShiftRate } = this.prop;
    const deltaPercent = scrollPercent - 0.08; // SHIP.BACKPEDAL (Move to somewhere else)
    return {
      x: (deltaPercent > 0) ? deltaPercent * layerStrength * scrollShiftRate : 0,
      y: 0
    };
  }

  moveBody(shift: Point) {
    // move to a point at a random and angle from center
    if (this.hasReachedOffset()) {
      this.setOffsetTo();
    }

    // calculate the delta x and y for the new
    const { x: newX, y: newY } = Motion.moveInDirection(
      this.state.offset,
      this.state.offset.to,
      this.prop.offsetSpeed
    );

    this.state.offset.x = newX;
    this.state.offset.y = newY;
    this.state.pos = {
      x: shift.x + this.state.offset.x,
      y: shift.y + this.state.offset.y,
    };
  }

  moveColors() {
    const { colorProp, radius } = this.prop;
    this.state.colorPos.angle =
      this.state.colorPos.angle + colorProp.angularVelocity;
    const oscillationAngle =
      Math.PI * colorProp.resizeFrequency * this.state.colorPos.angle;
    const oscillation = 0.5 * Math.sin(oscillationAngle) + 1;
    const min = radius * BODY.COLOR.DISTANCE_FROM_CENTER.min;
    const max = radius * BODY.COLOR.DISTANCE_FROM_CENTER.max;
    this.state.colorPos.smallRadius = min + oscillation * max;
    this.state.colorPos.distanceFromCenter =
      radius * (1 - BODY.COLOR.DISTANCE_FROM_CENTER.min) -
      this.state.colorPos.smallRadius;
  }

  drawSpectrum() {
    // planet
    const { colorSpectrum, radius } = this.prop;
    const { colorPos, pos } = this.state;
    const colorDelta = {
      x: colorPos.distanceFromCenter * Math.cos(colorPos.angle),
      y: colorPos.distanceFromCenter * Math.sin(colorPos.angle),
      r: radius - colorPos.smallRadius,
    };
    for (let i = 0; i < colorSpectrum.length; ++i) {
      this.ctx.beginPath();
      this.ctx.arc(
        pos.x - (colorDelta.x * i) / colorSpectrum.length,
        pos.y - (colorDelta.y * i) / colorSpectrum.length,
        radius - (colorDelta.r * i) / colorSpectrum.length,
        0,
        2 * Math.PI,
        false
      );
      this.ctx.fillStyle = Color.toString(colorSpectrum[i]); //A(1-(.05*i));
      this.ctx.fill();
    }

    // overlay
    const grd = this.ctx.createRadialGradient(
      pos.x - colorDelta.x,
      pos.y - colorDelta.y,
      0,
      pos.x - colorDelta.x,
      pos.y - colorDelta.y,
      radius
    );
    grd.addColorStop(
      0,
      Color.toString(colorSpectrum[colorSpectrum.length - 1], BODY.COLOR.OVERLAY_OPACITY_INSIDE)
    );
    grd.addColorStop(
      1,
      Color.toString(colorSpectrum[colorSpectrum.length - 1], BODY.COLOR.OVERLAY_OPACITY_OUTSIDE)
    );
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = grd;
    this.ctx.fill();
  }

  drawTrail() {
    const { radius, colorSpectrum } = this.prop;
    const { x, y } = this.state.pos;
    const grd = this.ctx.createLinearGradient(x, y - radius, x, y + radius);
    grd.addColorStop(
      0,
      Color.toString(colorSpectrum[0], BODY.TRAIL.OPACITY_OUTSIDE)
    );
    grd.addColorStop(
      BODY.TRAIL.COLOR_STOP,
      Color.toString(colorSpectrum[0], BODY.TRAIL.OPACITY_INSIDE)
    );
    grd.addColorStop(
      1 - BODY.TRAIL.COLOR_STOP,
      Color.toString(colorSpectrum[0], BODY.TRAIL.OPACITY_INSIDE)
    );
    grd.addColorStop(
      1,
      Color.toString(colorSpectrum[0], BODY.TRAIL.OPACITY_OUTSIDE)
    );
    this.ctx.beginPath();
    this.ctx.rect(x, y - radius, this.visual.W * 2, 2 * radius);
    this.ctx.fillStyle = grd;
    this.ctx.fill();
  }
}
