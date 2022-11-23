
import type Color from "color";
import { Visual } from "$lib/visual";
import { Building } from "./Building";
import { FREEDOM_TOWER, TAIPEI_101 } from "./buildings";
// import { COLOR_PALLET } from "./const";

// const BUILDING_SPACING_Y = 50;
// const BUILDING_SPACING_X = 80;

export class CityVisual extends Visual {
  static visualName = 'Night City';
  static visualLink = 'night-city';
  buildings: Building[];
  layers: (Building | Color)[];

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.buildings = [];
    this.layers = [];
  }

  setup() {
    // for (let y = -BUILDING_SPACING_Y; y < this.H + BUILDING_SPACING_Y; y += 4 * BUILDING_SPACING_Y) {
    //   for (let x = -BUILDING_SPACING_X; x < this.W + BUILDING_SPACING_X; x += BUILDING_SPACING_X + 8) {
    //     const newBuilding = new Building(this, {
    //       x: x + Random.number(-12, 28),
    //       y: y
    //     })
    //     this.buildings.push(newBuilding);
    //     this.layers.push(newBuilding);
    //   },
    //   this.layers.push(Color(Random.arrayItem(COLOR_PALLET)));
    // }

    this.buildings.push(new Building(this, {
      x: this.W / 3,
      y: this.H / 2
    }, FREEDOM_TOWER));

    this.buildings.push(new Building(this, {
      x: this.W / 2,
      y: this.H / 2
    }));

    this.buildings.push(new Building(this, {
      x: 2 * this.W / 3,
      y: this.H / 2
    }, TAIPEI_101));
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
