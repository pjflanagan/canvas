import { Canvas } from '$lib/canvas';
import { Visual } from '$lib/visual';
import { GUITAR_STRING, GuitarString } from './GuitarString';

const GUITAR_STRING_COUNT = 6;
const GUITAR_STRING_GAP = GUITAR_STRING.MAX_OFFSET_X / 2 + 24;
const NECK_WIDTH = GUITAR_STRING_COUNT * GUITAR_STRING.WIDTH + (GUITAR_STRING_COUNT - 1) * GUITAR_STRING_GAP;

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
      const stringPosition = i * GUITAR_STRING_GAP + i * GUITAR_STRING.WIDTH;
      const guitarString = new GuitarString(this, halfWidth - halfNeck + stringPosition); // , i === GUITAR_STRING_COUNT - 1);
      this.strings.push(guitarString);
    }
  }

  drawFrame() {
    this.drawBackground();
    this.strings.forEach((s) => {
      for (let i = 0; i < 6; ++i) {
        s.move();
      }
      s.draw();
    });
  }

  drawBackground() {
    // this.ctx.clearRect(0, 0, this.W, this.H);
    // TODO: Jack White guitar: https://www.google.com/search?sca_esv=23c20ded85caa685&rlz=1C5GCEM_en&q=white+stripes+guitar&uds=ADvngMjGL2z_dD6sqKl5mZzQ0EevMtgGr9LXrm1bI25pTrrQRrxQM_gRarhaPrpA4zV2YB-zF-B0i5tdaqb26pzF0AVYJHgUFdoedSqVbCIs9_gbDQ2ItvEB6nCZSuKHrFiwJgSlrKm7lf9qMWtc6g_UXdWibxKJzzfC6578mwPMc1fkEAGH3UIfqV8_H4FechNTqRjF8DliKm5BCGzAfFrpR2jCEABtcU2TmJ_8478PYefZ4W7ZyMEZiGuRFmfp4GjD4EOqDG5uaKaBsy5gvLos9JB_cTrLNp3nDksbQFsvkQCZ4spTyx-NSKXA72n_xqFcQMwlpZ1zuWOTvlsZ-pKt_QKU5VrEWQ&udm=2&prmd=ivsnmbt&sa=X&ved=2ahUKEwiTr6iiiMWGAxV7D1kFHcexDOIQtKgLegQIFRAB&biw=1573&bih=814&dpr=2
    Canvas.draw(this.ctx, {
      layers: [
        {
          id: 'background',
          strokes: [['rect', 0, 0, this.W, this.H]],
          fillStyle: '#610706',
        },
        {
          id: 'neck',
          strokes: [[
            'rect',
            this.W / 2 - NECK_WIDTH / 2 - GUITAR_STRING_GAP / 2 - GUITAR_STRING.WIDTH, 0,
            NECK_WIDTH + GUITAR_STRING_GAP, this.H
          ]],
          fillStyle: '#0a0a0a',
        },
      ],
    });
  }
}
