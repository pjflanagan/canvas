
import { Visual } from "$lib/visual";
import { Random } from "$lib/util";
import type { Body } from "./Body";
import { Star } from "./Star";
import { Moon } from "./Moon";
import { Ship } from "./Ship";
import { Planet } from "./Planet";
import { draw } from "$lib/draw";

const CANVAS = {
  STARS: { min: 84, max: 164 },
  BACKGROUND_MOONS: { min: 2, max: 7 },
  FOREGROUND_MOONS: { min: 3, max: 5 },
};

export class Space extends Visual {
  bodies: Body[];

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.bodies = [];
  }

  setup() {
    // add things to bodies in order from bottom to top
    const starCount = Random.prop(CANVAS.STARS);
    for (let i = 0; i < starCount; ++i) {
      this.bodies.push(new Star(this, 0, i));
    }

    const starCount2 = Random.prop(CANVAS.STARS);
    for (let i = 0; i < starCount2; ++i) {
      this.bodies.push(new Star(this, 1, i));
    }

    const bgMoonCount = Random.prop(CANVAS.BACKGROUND_MOONS);
    for (let i = 0; i < bgMoonCount; ++i) {
      this.bodies.push(new Moon(this, 2, i));
    }

    const bgMoonCount2 = Random.prop(CANVAS.BACKGROUND_MOONS);
    for (let i = 0; i < bgMoonCount2; ++i) {
      this.bodies.push(new Moon(this, 3, i));
    }

    this.bodies.push(new Planet(this, 4, 0));
    this.bodies.push(new Ship(this, 5, 0)); // TODO: SET LAYERS AS NAMES SHIP_LAYER

    const fgMoonCount = Random.prop(CANVAS.FOREGROUND_MOONS);
    for (let i = 0; i < fgMoonCount; ++i) {
      this.bodies.push(new Moon(this, 6, i));
    }

    const fgMoonCount2 = Random.prop(CANVAS.FOREGROUND_MOONS);
    for (let i = 0; i < fgMoonCount2; ++i) {
      this.bodies.push(new Moon(this, 7, i));
    }

    const starCount3 = Random.prop(CANVAS.STARS);
    for (let i = 0; i < starCount3; ++i) {
      this.bodies.push(new Star(this, 8, i));
    }
  }

  drawFrame() {
    this.drawBackground();
    this.bodies.forEach((body) => {
      body.move();
      body.draw();
    });
  }

  drawBackground() {
    console.log('drawBackground');
    draw(this.ctx, {
      layers: [
        {
          id: 'background',
          strokes: [
            ['rect', 0, 0, this.W, this.H]
          ],
          fillStyle: "#1c1c1c"
        }
      ]
    })
  }
}

