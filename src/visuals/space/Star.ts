import { ColorMixer, Random } from "$lib/util";
import { Body } from "./Body";
// import type { SpaceVisual } from "./SpaceVisual";

const STAR = {
  RADIUS: { min: 0.0008, max: 0.002 },
  OFFSET: {
    SPEED: 0.1,
    MAX_RADIUS: 20,
  },
  CENTER: {
    x: { min: -0.5, max: 1 },
    y: { min: 0.001, max: 0.999 }
  },
  SCROLL_SHIFT_RATE: 21
};

export class Star extends Body {
  // constructor(space: SpaceVisual, layer: number, id: number) {
  //   super(space, layer, id);
  // }

  setup() {
    // unchanging props
    this.prop = {
      center: {
        x: Random.prop(STAR.CENTER.x, this.visual.W),
        y: Random.prop(STAR.CENTER.y, this.visual.H),
      }, // planet is in the center
      radius: Random.prop(STAR.RADIUS, this.visual.H),
      color: ColorMixer.getRandomColor(),
      offsetRadiusMax: STAR.OFFSET.MAX_RADIUS,
      offsetSpeed: STAR.OFFSET.SPEED,
      scrollShiftRate: STAR.SCROLL_SHIFT_RATE
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
    this.ctx.fillStyle = color.toString();
    this.ctx.fill();
  }
}

