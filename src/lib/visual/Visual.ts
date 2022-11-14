
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
  mousePos: Point;

  scrollPercent: number;

  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;

    // properties
    this.W = window.innerWidth;
    this.H = window.innerHeight;
  
    this.shorterSide = Math.min(this.W, this.H);
    this.diagonalLength = distance({ x: 0, y: 0 }, { x: this.W, y: this.H });

    // user input
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    // user position
    this.mousePos = {
      x: 0,
      y: 0
    }
    // TODO: This should just be a number, if percent is important, calculate it in the child
    this.scrollPercent = 0;
  }

  setup() {
    throw 'Method needs to be implemented by child of Canvas.';
  }

  drawFrame() {
    throw 'Method needs to be implemented by child of Canvas.';
  }

  handleMouseMove(e: MouseEvent) {
    this.mousePos = {
      x: e.clientX,
      y: e.clientY,
    };
  }

  handleScroll() {
    const scroll = window.scrollY;
    this.scrollPercent = Math.min(scroll / (this.H * 3), 1);
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
