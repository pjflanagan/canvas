
// this is a class that can be extended to make different visuals

import { distance } from "$lib/grid";
import type { Point } from "$lib/util";

export class Visual {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  shorterSide: number;
  diagonalLength: number;
  isRunning?: boolean;
  animationReq?: number;

  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;

    // properties
    this.W = window.innerWidth;
    this.H = window.innerHeight;
  
    this.shorterSide = Math.min(this.W, this.H);
    this.diagonalLength = distance({ x: 0, y: 0 }, { x: this.W, y: this.H });

    // setup and animate
    this.setup();
    this.animate = this.animate.bind(this);
    this.start();
  }

  setup() {
    throw 'Method needs to be implemented by child of Canvas.';
  }

  drawFrame() {
    throw 'Method needs to be implemented by child of Canvas.';
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  animate() {
    this.drawFrame();
    this.animationReq = window.requestAnimationFrame(this.animate.bind(this));
  }

  stop() {
    if (this.animationReq) {
      window.cancelAnimationFrame(this.animationReq);
    }
    this.isRunning = false;
  }
}

export class InteractiveVisual extends Visual {
  angle: number;
  strength: number;
  scrollPercent: number;

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    // user position
    this.angle = 0;
    this.strength = 0;
    this.scrollPercent = 0;

    // user input
    this.onMouseMove = this.onMouseMove.bind(this);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.onmousemove((e: MouseEvent) => {
      const mouse = {
        x: e.clientX,
        y: e.clientY,
      };
      this.onMouseMove(mouse);
    })
    
    this.onScroll = this.onScroll.bind(this);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.onscroll(() => {
      const scroll = window.scrollY;
      this.onScroll(scroll);
    });
  }

  onMouseMove(mouse: Point) {
    const center = {
      x: this.W / 2,
      y: this.H / 2,
    };
    this.angle = Math.atan2(mouse.y - center.y, mouse.x - center.x);
    this.strength = distance(center, mouse) / (this.diagonalLength / 2);
  }

  onScroll(scroll: number) {
    this.scrollPercent = Math.min(scroll / (this.H * 3), 1);
  }
}