
// this is a class that can be extended to make different visuals

import { type Point, distance } from "$lib/util";

export class Visual {
  protected ctx: CanvasRenderingContext2D;
  protected W: number;
  protected H: number;
  protected shorterSideLength: number;
  protected diagonalLength: number;
  protected isRunning?: boolean;
  protected animationReq?: number;
  protected mousePos: Point;
  protected scrollY: number;

  // multiplied by H to get the length of max scroll
  public maxScrollHeightFactor: number;

  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;

    // properties
    this.W = window.innerWidth;
    this.H = window.innerHeight;
  
    this.shorterSideLength = Math.min(this.W, this.H);
    this.diagonalLength = distance({ x: 0, y: 0 }, { x: this.W, y: this.H });

    // user input
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.maxScrollHeightFactor = 0;

    // user position
    this.mousePos = {
      x: 0,
      y: 0
    }
    // TODO: This should just be a number, if percent is important, calculate it in the child
    this.scrollY = 0;
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  getSize() {
    return {
      H: this.H, 
      W: this.W,
      shorterSideLength: this.shorterSideLength, 
      diagonalLength: this.diagonalLength
    }
  }

  getUserPosition() {
    return {
      scrollY: this.scrollY,
      mousePos: this.mousePos
    }
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

  handleScroll(scrollY: number) {
    this.scrollY = scrollY
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
