import { ColorMixer, Geometry, Motion, Random, type Point } from '$lib/util';
import { Visual } from '$lib/visual';

const DRAW_TICK_INTERVAL = 10;

export enum ColorMode {
  Random = 'Random',
  Rainbow = 'Rainbow',
  Linear = 'Linear',
  White = 'White',
}

export const COLOR_MODE_LIST = [
  ColorMode.Random,
  ColorMode.Rainbow,
  ColorMode.Linear,
  ColorMode.White,
];

type WalkProperties = {
  stepLength: number;
  stepWidth: number;
  backgroundOpacity: number;
  restartWhenEdgeReached: boolean;
  fadeOut: boolean;
  colorMode: ColorMode;
};

function getDefaultWalkProperties(): WalkProperties {
  return {
    stepLength: 64,
    stepWidth: 8,
    backgroundOpacity: 0.07,
    restartWhenEdgeReached: true,
    fadeOut: false,
    colorMode: ColorMode.Rainbow,
  };
}

function getRandomWalkProperties(): WalkProperties {
  return {
    stepLength: Random.number(1, 150),
    stepWidth: Random.number(1, 100),
    backgroundOpacity: parseFloat((Math.random() * 0.15).toFixed(2)),
    restartWhenEdgeReached: Random.boolean(),
    fadeOut: Random.boolean(),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    colorMode: Random.arrayItem(COLOR_MODE_LIST)!,
  };
}

export class RandomWalkVisual extends Visual {
  static visualName = 'Random Walk';
  static visualLink = 'random-walk';
  centerPoint: Point;
  currentPoint: Point;
  stepCount: number;

  walkProperties: WalkProperties;

  constructor(context: CanvasRenderingContext2D) {
    super(context);
    this.centerPoint = {
      x: this.W / 2,
      y: this.H / 2,
    };
    this.currentPoint = this.centerPoint;
    this.stepCount = 0;
    this.walkProperties = getDefaultWalkProperties();

    this.randomize = this.randomize.bind(this);
    this.restartCurrentWalk = this.restartCurrentWalk.bind(this);
  }

  setup() {
    this.drawBackground(1);
  }

  drawFrame(): void {
    if (this.isPointOutOfBounds(this.currentPoint) && this.walkProperties.restartWhenEdgeReached) {
      this.restartCurrentWalk(true);
    }
    if (this.frameIndex % DRAW_TICK_INTERVAL === 0) {
      this.drawAndMoveLine();
      if (this.walkProperties.fadeOut) {
        this.drawBackground(this.walkProperties.backgroundOpacity);
      }
    }
  }

  drawAndMoveLine() {
    let nextPoint: Point;
    let nextAngle: number;

    do {
      nextAngle = Math.random() * Math.PI * 2;
      nextPoint = Motion.getPointInDirection(
        this.currentPoint,
        nextAngle,
        this.walkProperties.stepLength,
      );
    } while (this.isPointOutOfBounds(nextPoint) && !this.walkProperties.restartWhenEdgeReached);

    this.ctx.beginPath();
    this.ctx.moveTo(this.currentPoint.x, this.currentPoint.y);
    this.ctx.lineTo(nextPoint.x, nextPoint.y);
    this.ctx.lineWidth = this.walkProperties.stepWidth;
    this.ctx.strokeStyle = this.getColorForColorMode();
    this.ctx.stroke();

    this.currentPoint = nextPoint;
    this.stepCount += 1;
  }

  randomize() {
    this.walkProperties = getRandomWalkProperties();
  }

  distanceFromOrgin(pos: Point) {
    return Geometry.distance(pos, this.centerPoint);
  }

  getColorForColorMode(): string {
    switch (this.walkProperties.colorMode) {
      case ColorMode.Random:
        return ColorMixer.toString(ColorMixer.getRandomColor());
      case ColorMode.Linear:
        return this.getLinearColor();
      case ColorMode.Rainbow:
        return this.getRainbowColor();
      case ColorMode.White:
      default:
        return 'rgba(255,255,255,0.3)';
    }
  }

  isPointOutOfBounds(point: Point) {
    return point.x > this.W || point.x < 0 || point.y > this.H || point.y < 0;
  }

  getRainbowColor() {
    const ratio = this.distanceFromOrgin(this.currentPoint) / (this.longerSideLength / 2);
    return ColorMixer.getHueColorString(ratio);
  }

  getLinearColor() {
    return ColorMixer.getHueColorString(this.stepCount / 360);
  }

  restartCurrentWalk(blackOutBackground = true) {
    this.drawBackground(blackOutBackground ? 1 : this.walkProperties.backgroundOpacity);
    this.currentPoint = {
      x: this.W / 2,
      y: this.H / 2,
    };
    this.stepCount = 0;
  }

  drawBackground(opacity: number) {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.W, this.H);
    this.ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    this.ctx.fill();
    //ctx.globalCompositeOperation = "lighter";
  }
}
