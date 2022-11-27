import { Motion, Random } from '$lib/util';
import { Visual } from '$lib/visual';
import { Building } from './Building';
import { FREEDOM_TOWER, TAIPEI_101 } from './buildings';
import { BUILDING_HEIGHT, BUILDING_WIDTH, PERSPECTIVE } from './const';

const BUILDING_SPACING_X = BUILDING_WIDTH * 1.8;
const BUILDING_SPACING_Y = 3 * PERSPECTIVE * BUILDING_SPACING_X;

export class CityVisual extends Visual {
  static visualName = 'Night City';
  static visualLink = 'night-city';
  buildings: Building[];

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.buildings = [];
  }

  setup() {
    const maxX = this.W + BUILDING_SPACING_X
    const maxY = this.H - BUILDING_HEIGHT / 2;
    // start in the top left and work our way down to the right
    // TODO: we are making too many buildings
    let row = 0;
    let buildingX = 0;
    let buildingY = 0;
    while (buildingX < maxX || buildingY < maxY) {
      for (let y = 0; y <= row; y++) {
        for (let x = row; x >= 0; x--) {
          const drawX = x * BUILDING_SPACING_X + Random.number(-4, 4);
          const drawY = y * BUILDING_SPACING_Y;
          if (
            Motion.isInBounds(
              { x: drawX, y: drawY },
              { x: this.W + 8, y: maxY },
              { x: -8, y: -8 },
            )
          ) {
            const newBuilding = new Building(this, {
              x: drawX,
              y: drawY,
            });
            this.buildings.push(newBuilding);
          }
        }
      }
      buildingX = row * BUILDING_SPACING_X;
      buildingY = row * BUILDING_SPACING_Y;
      row += BUILDING_WIDTH; // TODO: this makes less buildings, but they aren't placed properly
    }

    // TODO: there are too many buildings on the top
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
    this.buildings.forEach((building) => {
      building.move();
      building.draw();
    });
  }

  drawBackground() {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.W, this.H);
    this.ctx.fillStyle = '#1c1c1c';
    this.ctx.fill();
  }

  // TODO: the mouse makes buildings below it rise a little further up
  // the area needs to be a kind of oval a few pixels below the mouse
  // for each building in buildings
}
