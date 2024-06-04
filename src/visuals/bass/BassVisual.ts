import { Canvas } from '$lib/canvas';
import { Random, type Point } from '$lib/util';
import { Visual } from '$lib/visual';
import { BASS_STRING, BassString } from './BassString';

const BASS_STRING_COUNT = 1; // 4
const BASS_STRING_GAP = BASS_STRING.MAX_OFFSET_X + 6;
const NECK_WIDTH = BASS_STRING_COUNT * (BASS_STRING.WIDTH + BASS_STRING_GAP);

export class BassVisual extends Visual {
  static visualName = 'Bass';
  static visualLink = 'bass';
  strings: BassString[];

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.strings = [];
  }

  setup() {
    for (let i = 0; i < BASS_STRING_COUNT; ++i) {
      const halfWidth = this.W / 2;
      const halfNeck = NECK_WIDTH / 2;
      const stringPosition = i * BASS_STRING_GAP;
      const bassString = new BassString(this, halfWidth - halfNeck + stringPosition);
      this.strings.push(bassString);
    }
  }

  drawFrame() {
    this.drawBackground();
    this.strings.forEach((s) => {
      s.move();
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
