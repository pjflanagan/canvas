
// this is a class that can be extended to make different visuals

import { distance } from "$lib/grid";

export class Visual {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  shorterSide: number;
  diagonalLength: number;
  isRunning?: boolean;
  animationReq?: number;

  angle: number;
  strength: number;
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
    // TODO: THESE ARE FOR A SPECIFIC VISUAL AND SHOULD BE CHANGED
    this.angle = 0;
    this.strength = 0;
    this.scrollPercent = 0;
  }

  setup() {
    throw 'Method needs to be implemented by child of Canvas.';
  }

  drawFrame() {
    throw 'Method needs to be implemented by child of Canvas.';
  }

  handleMouseMove(e: MouseEvent) {
    const mouse = {
      x: e.clientX,
      y: e.clientY,
    };
    const center = {
      x: this.W / 2,
      y: this.H / 2,
    };
    this.angle = Math.atan2(mouse.y - center.y, mouse.x - center.x);
    this.strength = distance(center, mouse) / (this.diagonalLength / 2);
  }

  handleScroll() {
    const scroll = window.scrollY;
    this.scrollPercent = Math.min(scroll / (this.H * 3), 1);
  }

  start() {
    this.setup();
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
