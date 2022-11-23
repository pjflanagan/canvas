// import { Random } from "$lib/util";
import { Canvas } from "$lib/canvas";
import { ColorMixer, Random } from "$lib/util";
import { Visual } from "$lib/visual";
import Color from "color";
import { Building } from "./Building";
import { FREEDOM_TOWER, TAIPEI_101 } from "./buildings";
import { COLOR_PALLET } from "./const";

const BUILDING_SPACING_Y = 50;
const BUILDING_SPACING_X = 80;

type Layer = {
  glowColor?: Color;
  glowColorStart?: number;
  building?: Building;
}

export class CityVisual extends Visual {
  static visualName = 'Night City';
  static visualLink = 'night-city';
  buildings: Building[];
  layers: Layer[];

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.buildings = [];
    this.layers = [];
  }

  setup() {
    for (let y = -BUILDING_SPACING_Y; y < this.H + BUILDING_SPACING_Y; y += 4 * BUILDING_SPACING_Y) {
      this.layers.push({
        glowColorStart: y,
        glowColor: Color(Random.arrayItem(COLOR_PALLET))
      });
      for (let x = -BUILDING_SPACING_X; x < this.W + BUILDING_SPACING_X; x += BUILDING_SPACING_X + 8) {
        const newBuilding = new Building(this, {
          x: x + Random.number(-12, 28),
          y: y
        });
        this.buildings.push(newBuilding);
        this.layers.push({
          building: newBuilding
        });
      }
    }

    // this.buildings.push(new Building(this, {
    //   x: this.W / 3,
    //   y: this.H / 2
    // }, FREEDOM_TOWER));

    // this.buildings.push(new Building(this, {
    //   x: this.W / 2,
    //   y: this.H / 2
    // }));

    // this.buildings.push(new Building(this, {
    //   x: 2 * this.W / 3,
    //   y: this.H / 2
    // }, TAIPEI_101));
    return;
  }

  drawFrame() {
    this.drawBackground();
    this.layers.forEach(layer => {
      if (layer.building) {
        layer.building.move();
        layer.building.draw();
      } else if (layer.glowColor && layer.glowColorStart) {
        this.drawGlowLayer(layer.glowColor, layer.glowColorStart);
      }
    });
  }

  drawGlowLayer(color: Color, glowStart: number) {
    // TODO: the gradient needs to end at building height, not this.H
    const grd = this.ctx.createLinearGradient(0, 0, 0, glowStart);
    grd.addColorStop(0, color.fade(1).string());
    grd.addColorStop(0.7, color.fade(1).string());
    grd.addColorStop(1, color.fade(0.5).string());
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.W, this.H);
    this.ctx.fillStyle = grd;
    this.ctx.fill();
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
