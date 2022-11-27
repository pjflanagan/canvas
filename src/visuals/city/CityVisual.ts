import { Geometry, Motion, Random, ZERO_POINT } from '$lib/util';
import { Visual } from '$lib/visual';
import Color from 'color';
import { Building } from './Building';
import { FREEDOM_TOWER, TAIPEI_101 } from './buildings';
import { BUILDING_HEIGHT, BUILDING_WIDTH, GLOW_COLORS, PERSPECTIVE } from './const';

const BUILDING_SPACING_X = BUILDING_WIDTH * 1.4;
const BUILDING_SPACING_Y = PERSPECTIVE * BUILDING_SPACING_X;
const ROW_SPACING_X = BUILDING_HEIGHT;

type Layer = {
  building?: Building;
  glowColor?: Color;
  glowDistance?: number;
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
    const minPoint = {
      x: -BUILDING_SPACING_X,
      y: -BUILDING_HEIGHT - 1
    };
    const maxPoint = {
      x: this.W + BUILDING_SPACING_X,
      y: this.H - BUILDING_HEIGHT * PERSPECTIVE
    };
    // start in the top right and work our way down to the left
    let row = 0;
    let buildingX = 0;
    let buildingY = 0;
    while (buildingX < maxPoint.x || buildingY < maxPoint.y) {
      let y = -BUILDING_HEIGHT;
      let x = row * ROW_SPACING_X;
      while (y < maxPoint.y || x > minPoint.x) {
        if (Motion.isInBounds({ x, y }, maxPoint, minPoint)) {
          const newBuilding = new Building(this, {
            x: x + Random.number(-6, 6),
            y,
          });
          this.buildings.push(newBuilding);
          this.layers.push({
            building: newBuilding,
          });
        }
        y += BUILDING_SPACING_Y;
        x -= BUILDING_SPACING_X;
      }
      buildingX = row * BUILDING_SPACING_X;
      buildingY = row * BUILDING_SPACING_Y;
      this.layers.push({
        glowColor: Color(Random.arrayItem(GLOW_COLORS)),
        glowDistance: Geometry.distance(ZERO_POINT, { x: buildingX, y: buildingY }),
      });
      row += 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Random.arrayItem(this.buildings)!.remakeBuildingFromInstructions(FREEDOM_TOWER);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Random.arrayItem(this.buildings)!.remakeBuildingFromInstructions(TAIPEI_101);
    return;
  }

  drawFrame() {
    this.drawBackground();
    this.layers.forEach(({ building, glowColor, glowDistance }) => {
      if (building) {
        building.setOffset(this.mousePos);
        building.move();
        building.draw();
      } else if (glowColor && glowDistance) {
        this.drawGlowLayer(glowColor, glowDistance);
      }
    });
  }

  drawBackground() {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.W, this.H);
    this.ctx.fillStyle = '#1c1c1c';
    this.ctx.fill();
  }

  drawGlowLayer(color: Color, glowDistance: number) {
    const glowRatio = glowDistance / this.diagonalLength;
    if (glowRatio < 0.92) {
      const grd = this.ctx.createLinearGradient(0, 0, this.diagonalLength * PERSPECTIVE, this.diagonalLength);
      grd.addColorStop(0, color.fade(1).string());
      grd.addColorStop(glowRatio, color.fade(1).string());
      grd.addColorStop(0.92, color.fade(0.8).string());
      grd.addColorStop(1, color.string());
      this.ctx.beginPath();
      this.ctx.rect(0, 0, this.W, this.H);
      this.ctx.fillStyle = grd;
      this.ctx.fill();
    }
  }
}
