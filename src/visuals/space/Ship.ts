import { Body } from "./Body";
import type { Space } from "./Space";

export const SHIP = {
  CENTER: {
    x: 1 / 6, // proportional to space
    y: 0.5,
  },
  OFFSET: {
    MAX_RADIUS: 80,
    SPEED: 0.3,
  },
  COLORS: {
    EXHAUST_EDGE: "#F00c",
    EXHAUST_MIDDLE: "#F008",
    EXHAUST_PORT: "#555",
    FINS: "#777",
    WINDOWS: "#222",
    BODY: "#EEE",
    SHADOW: "#0004",
  },
  BACKPEDAL: 0.08, // proportion scroll percent
  EXHAUST_LENGTH: 0.2
};

export class Ship extends Body {
  constructor(space: Space, layer: number, id: number) {
    super(space, layer, id);
  }

  setup() {
    const { W, H } = this.visual;
    this.prop = {
      center: {
        x: W * SHIP.CENTER.x,
        y: H * SHIP.CENTER.y,
      }, // planet is in the center
      offsetRadiusMax: SHIP.OFFSET.MAX_RADIUS,
      offsetSpeed: SHIP.OFFSET.SPEED,
      exhaustLength: SHIP.EXHAUST_LENGTH * W
    };
    // this.formula = {
    //   exhaustEnd: new QuadraticFormula(
    //     {x: 0, y:0 },
    //     {x: SHIP.BACKPEDAL, y: -500 }
    //   )
    // }
  }

  move() {
    const mouseShift = this.getMouseShiftedCenter();
    const scrollShift = this.getShipScrollShiftedCenter();
    this.moveBody({
      x: mouseShift.x + scrollShift.x,
      y: mouseShift.y + scrollShift.y,
    });
  }

  getShipScrollShiftedCenter() {
    const { scrollPercent, W, H } = this.visual;
    return {
      x: Math.pow(scrollPercent - SHIP.BACKPEDAL, 2) * -SHIP.CENTER.x * W * 4,
      y: scrollPercent * -200, // Math.pow(scrollPercent - SHIP.BACKPEDAL, 2) * -SHIP.CENTER.y * H
    };
  }

  draw() {
    this.drawExhaust();
    this.drawShip();
  }

  drawExhaust() {
    const { pos } = this.state;
    const { scrollPercent, W, H } = this.visual;
    const { exhaustLength } = this.prop;

    const lineLenX = -exhaustLength * (scrollPercent - SHIP.BACKPEDAL) + exhaustLength;
    const inverseLenX = 2 * (exhaustLength - lineLenX);
    // const exhaustEnd = this.formula.exhaustEnd.calc(scrollPercent)
    const exhaustEnd = Math.pow(scrollPercent, 2) * exhaustLength;
    const width = 5; // (scrollPercent > 0.9) ? (scrollPercent - 0.9) * H / 2 + 5 : 5
    const quadraticPointWidth = 5; // this can only be changed once the lineLen is 0
    // const quadraticPointWidth = (scrollPercent > 0.6) ? (H / 2) * (scrollPercent - 0.6) + width : width;

    const grd = this.ctx.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, SHIP.COLORS.EXHAUST_EDGE);
    grd.addColorStop(0.5, SHIP.COLORS.EXHAUST_MIDDLE);
    grd.addColorStop(1, SHIP.COLORS.EXHAUST_EDGE);

    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y - width);
    this.ctx.lineTo(pos.x + lineLenX, pos.y - width);
    this.ctx.quadraticCurveTo(W - inverseLenX, pos.y - quadraticPointWidth, W - exhaustEnd, 0);
    this.ctx.lineTo(2 * W, 0);
    this.ctx.lineTo(2 * W, H);
    this.ctx.lineTo(W - exhaustEnd, H);
    this.ctx.quadraticCurveTo(
      W - inverseLenX,
      pos.y + quadraticPointWidth,
      pos.x + lineLenX,
      pos.y + width
    );
    this.ctx.lineTo(pos.x, pos.y + width);
    this.ctx.fillStyle = grd;
    this.ctx.fill();
  }

  drawShip() {
    const { x, y } = this.state.pos;
    // exhaust port
    this.ctx.beginPath();
    this.ctx.moveTo(x + 35, y - 10);
    this.ctx.lineTo(x + 45, y - 5);
    this.ctx.lineTo(x + 45, y + 5);
    this.ctx.lineTo(x + 35, y + 10);
    this.ctx.fillStyle = SHIP.COLORS.EXHAUST_PORT;
    this.ctx.fill();

    // body
    this.ctx.beginPath();
    this.ctx.moveTo(x + 35, y - 10);
    this.ctx.quadraticCurveTo(x + 20, y - 30, x - 50, y);
    this.ctx.quadraticCurveTo(x + 20, y + 30, x + 35, y + 10);
    this.ctx.fillStyle = SHIP.COLORS.BODY;
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(x - 50, y);
    this.ctx.quadraticCurveTo(x + 20, y + 30, x + 35, y + 10);
    this.ctx.lineTo(x + 35, y - 10);
    this.ctx.quadraticCurveTo(x + 20, y + 24, x - 50, y);
    this.ctx.fillStyle = SHIP.COLORS.SHADOW;
    this.ctx.fill();

    // 3 windows
    for (let i = 0; i < 3; ++i) {
      this.ctx.beginPath();
      this.ctx.arc(x - 18 + i * 14, y, 4, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = SHIP.COLORS.WINDOWS;
      this.ctx.fill();
    }

    // fins
    this.ctx.beginPath();
    this.ctx.moveTo(x + 6, y - 14);
    this.ctx.lineTo(x + 30, y - 28);
    this.ctx.lineTo(x + 72, y - 30);
    this.ctx.lineTo(x + 34, y - 22);
    this.ctx.lineTo(x + 26, y - 10);
    this.ctx.quadraticCurveTo(x + 18, y - 14, x + 6, y - 14);
    this.ctx.fillStyle = SHIP.COLORS.FINS;
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(x + 6, y + 14);
    this.ctx.lineTo(x + 30, y + 28);
    this.ctx.lineTo(x + 72, y + 30);
    this.ctx.lineTo(x + 34, y + 22);
    this.ctx.lineTo(x + 26, y + 10);
    this.ctx.quadraticCurveTo(x + 18, y + 14, x + 6, y + 14);
    this.ctx.fillStyle = SHIP.COLORS.FINS;
    this.ctx.fill();
  }
}

