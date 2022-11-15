import { Canvas, type DrawingInstructions } from '$lib/canvas';
import { Body } from './Body';

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
    EXHAUST_EDGE: '#F00c',
    EXHAUST_MIDDLE: '#F008',
    EXHAUST_PORT: '#555',
    FINS: '#777',
    WINDOWS: '#222',
    BODY: '#EEE',
    SHADOW: '#0004',
  },
  BACKPEDAL: 0.08, // proportion scroll percent
  EXHAUST_LENGTH: 0.2
};

const SHIP_INSTRUCTIONS: DrawingInstructions = {
  layers: [
    {
      id: 'thruster',
      strokes: [
        ['moveTo', 35, -10],
        ['lineTo', 45, -5],
        ['lineTo', 45, 5],
        ['lineTo', 35, 10]
      ],
      fillStyle: SHIP.COLORS.EXHAUST_PORT
    },
    {
      id: 'body',
      strokes: [
        ['moveTo', 35, -10],
        ['quadraticCurveTo', 20, -30, -50, 0],
        ['quadraticCurveTo', 20, 30, 35, 10],
      ],
      fillStyle: SHIP.COLORS.BODY
    },
    {
      id: 'body',
      strokes: [
        ['moveTo', -50, 0],
        ['quadraticCurveTo', 20, 30, 35, 10],
        ['lineTo', 35, -10],
        ['quadraticCurveTo', 20, 24, -50, 0],
      ],
      fillStyle: SHIP.COLORS.SHADOW
    },
    {
      id: 'window-1',
      strokes: [
        ['arc', -18 + 0, 0, 4, 0, 2 * Math.PI, false],
      ],
      fillStyle: SHIP.COLORS.WINDOWS
    },
    {
      id: 'window-2',
      strokes: [
        ['arc', -18 + 14, 0, 4, 0, 2 * Math.PI, false],
      ],
      fillStyle: SHIP.COLORS.WINDOWS
    },
    {
      id: 'window-3',
      strokes: [
        ['arc', -18 + 28, 0, 4, 0, 2 * Math.PI, false],
      ],
      fillStyle: SHIP.COLORS.WINDOWS
    },
    {
      id: 'fin-1',
      strokes: [
        ['moveTo', 6, -14],
        ['lineTo', 30, -28],
        ['lineTo', 72, -30],
        ['lineTo', 34, -22],
        ['lineTo', 26, -10],
        ['quadraticCurveTo', 18, -14, 6, -14]
      ],
      fillStyle: SHIP.COLORS.FINS
    },
    {
      id: 'fin-2',
      strokes: [
        ['moveTo', 6, 14],
        ['lineTo', 30, 28],
        ['lineTo', 72, 30],
        ['lineTo', 34, 22],
        ['lineTo', 26, 10],
        ['quadraticCurveTo', 18, 14, 6, 14]
      ],
      fillStyle: SHIP.COLORS.FINS
    },
  ]
}
export class Ship extends Body {
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
    const { scrollPercent, W, } = this.visual;
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

    const grd = Canvas.createLinearGradient(this.ctx, {
      size: [0, 0, 0, H],
      colorStops: [
        [0, SHIP.COLORS.EXHAUST_EDGE],
        [0.5, SHIP.COLORS.EXHAUST_MIDDLE],
        [1, SHIP.COLORS.EXHAUST_EDGE]
      ]
    });
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

    Canvas.draw(this.ctx,
      SHIP_INSTRUCTIONS,
      {
        center: { x, y }
      }
    );
  }
}

