import { Random } from "$lib/util";
import { Visual } from "$lib/visual";
import { Building } from "./Building";
import { BUILDING_PERSPECTIVE_WIDTH, BUILDING_WIDTH } from "./const";

export class CityVisual extends Visual {
  static visualName = 'Night City';
  static visualLink = 'night-city';
  buildings: Building[];

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.buildings = [];
  }

  setup() {
    // for (let y = -BUILDING_PERSPECTIVE_WIDTH; y < this.H + BUILDING_PERSPECTIVE_WIDTH; y += 4 * BUILDING_PERSPECTIVE_WIDTH) {
    //   for (let x = -BUILDING_WIDTH; x < this.W + BUILDING_WIDTH; x += BUILDING_WIDTH  + 8) {
    //     this.buildings.push(new Building(this, {
    //       x: x + Random.number(-12, 28),
    //       y: y
    //     }));
    //   }
    // }

    this.buildings.push(new Building(this, {
      x: this.W / 2,
      y: this.H / 2
    }));
    return;
  }

  drawFrame() {
    this.drawBackground();
    this.buildings.forEach(b => {
      b.move();
      b.draw();
    });
  }

  drawBackground() {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.W, this.H);
    this.ctx.fillStyle = "#1c1c1c";
    this.ctx.fill();
  }

  // TODO: the mouse makes buildings below it rise a little further up
  // the area needs to be a kind of oval a few pixels below the mouse
}
