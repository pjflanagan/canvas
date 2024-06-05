import { Canvas } from '$lib/canvas';
import { Visual } from '$lib/visual';
import { GUITAR_STRING, GuitarString } from './GuitarString';

const GUITAR_STRING_COUNT = 6;
const GUITAR_STRING_GAP = GUITAR_STRING.MAX_OFFSET_X / 2 + 24;
const NECK_WIDTH = GUITAR_STRING_COUNT * (GUITAR_STRING.WIDTH + GUITAR_STRING_GAP);

export class GuitarVisual extends Visual {
  static visualName = 'Guitar';
  static visualLink = 'guitar';
  strings: GuitarString[];

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.strings = [];
  }

  setup() {
    for (let i = 0; i < GUITAR_STRING_COUNT; ++i) {
      const halfWidth = this.W / 2;
      const halfNeck = NECK_WIDTH / 2;
      const stringPosition = i * GUITAR_STRING_GAP;
      const guitarString = new GuitarString(this, halfWidth - halfNeck + stringPosition);
      this.strings.push(guitarString);
    }
  }

  drawFrame() {
    this.drawBackground();
    this.strings.forEach((s) => {
      for(let i = 0; i < 6; ++i) {
        s.move();
      }
      s.draw();
    });
  }

  drawBackground() {
    // this.ctx.clearRect(0, 0, this.W, this.H);
    Canvas.draw(this.ctx, {
      layers: [
        {
          id: 'background',
          strokes: [['rect', 0, 0, this.W, this.H]],
          fillStyle: '#1c1c1c',
        },
      ],
    });
  }
}
