import Color from "color";
import { Geometry, Random } from "$lib/util";
import { Visual } from "$lib/visual";
import { Building } from "./Building";
import { FREEDOM_TOWER, TAIPEI_101 } from "./buildings";
import { BUILDING_HEIGHT, BUILDING_WIDTH, GLOW_COLORS, PERSPECTIVE } from "./const";

const BUILDING_SPACING_X = BUILDING_WIDTH * 1.8;
const BUILDING_SPACING_Y = 5 * PERSPECTIVE * BUILDING_WIDTH;

export class CityVisual extends Visual {
  static visualName = 'Night City';
  static visualLink = 'night-city';
  buildings: Building[];

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.buildings = [];
  }

  setup() {
    // start in the top left and work our way down to the right
    let row = 0;
    let buildingX = 0;
    let buildingY = 0;
    while (row < 8) { // (buildingX < this.W + BUILDING_SPACING_X || buildingY < this.H) {
      for (let y = 0; y <= row; y++) {
        for (let x = row; x >= 0; x--) {
          const drawX = x * BUILDING_SPACING_X + Random.number(-4, 4);
          const drawY = y * BUILDING_SPACING_Y;
          if (drawX < this.W + BUILDING_SPACING_X && drawY < this.H + BUILDING_SPACING_Y) {
            const newBuilding = new Building(this, {
              x: drawX,
              y: drawY
            });
            this.buildings.push(newBuilding);
          }
        }
      }
      buildingX = row * BUILDING_SPACING_X;
      buildingY = row * BUILDING_SPACING_Y;
      row += 1;
    }

    // TODO: there are more buildings than we need to display
    console.log('BUILDING COUNT', this.buildings.length);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Random.arrayItem(this.buildings)!.remakeBuildingFromInstructions(FREEDOM_TOWER);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Random.arrayItem(this.buildings)!.remakeBuildingFromInstructions(TAIPEI_101);

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
    this.buildings.forEach(building => {
        building.move();
        building.draw();
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
  // for each building in buildings
}
