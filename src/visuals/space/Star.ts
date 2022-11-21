import { Color, Random } from '$lib/util';
import { Body } from './Body';
// import type { SpaceVisual } from "./SpaceVisual";

const STAR = {
  RADIUS: { min: 0.0008, max: 0.002 },
  OFFSET: {
    SPEED: 0.1,
    MAX_RADIUS: 20,
  },
  CENTER: {
    x: { min: -0.5, max: 1 },
    y: { min: 0.001, max: 0.999 },
  },
  SCROLL_SHIFT_RATE: 21,
};

export class Star extends Body {
  setup() {
    const { W, H } = this.visual.getSize();
    // unchanging props
    this.prop = {
      center: {
        x: Random.propFloat(STAR.CENTER.x, W),
        y: Random.propFloat(STAR.CENTER.y, H),
      }, // planet is in the center
      radius: Random.propFloat(STAR.RADIUS, H),
      color: Color.getRandomColor(),
      offsetRadiusMax: STAR.OFFSET.MAX_RADIUS,
      offsetSpeed: STAR.OFFSET.SPEED,
      scrollShiftRate: STAR.SCROLL_SHIFT_RATE,
    };
  }

  move() {
    const mouseShift = this.getMouseShiftedCenter();
    const scrollShift = this.getScrollShiftedCenter();
    this.moveBody({
      x: mouseShift.x + scrollShift.x,
      y: mouseShift.y + scrollShift.y,
    });
  }

  draw() {
    const { radius, color } = this.prop;
    const { pos } = this.state;
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = Color.toString(color);
    this.ctx.fill();
  }
}
