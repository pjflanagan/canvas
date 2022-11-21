import { Canvas } from "$lib/canvas";
import { Random, type Point } from "$lib/util";
import { TAIPEI_101 } from "./buildings";
import type { CityVisual } from "./CityVisual";
import { BUILDING_HEIGHT } from "./const";
import type { Segment } from "./segments";

function chooseRandomDeltaY(): number {
  return Random.number(-40, 40);
}

// function makeRandomBuilding(): Segment[] {
//   const buildingSegments: Segment[] = [];
//   // push a bunch of base segments
//   let buildingHeight = 0;
//   while (buildingHeight < BUILDING_HEIGHT) {
//     const segment = Random.boolean() ? TAIPEI_101_SEGMENT : BASIC_SEGMENT;
//     buildingSegments.push(segment);
//     buildingHeight += segment.segmentHeight;
//   }
//   // then push a top segment
//   return buildingSegments;
// }

export type BuildingInstructions = {
  base?: Segment;
  top?: Segment;
  buildingPattern: Segment[];
}

function makeBuildingFromInstructions(buildingInstructions: BuildingInstructions): Segment[] {
  const buildingSegments: Segment[] = [];
  let buildingHeight = 0;
  
  if (buildingInstructions.base) {
    buildingSegments.push(buildingInstructions.base);
  }
  while (buildingHeight < BUILDING_HEIGHT) {
    buildingInstructions.buildingPattern.forEach(segment => {
      buildingSegments.push(segment);
      buildingHeight += segment.segmentHeight;
      console.log(buildingHeight);
    });
  }
  if (buildingInstructions.top) {
    buildingSegments.push(buildingInstructions.top);
  }

  return buildingSegments;
}

export class Building {
  visual: CityVisual;
  buildingTopPosition: Point;
  currentDeltaY: number;
  toDeltaY: number;
  speed: number;
  segments: Segment[];

  constructor(visual: CityVisual, buildingTopPosition: Point) {
    this.visual = visual;
    this.buildingTopPosition = buildingTopPosition;
    this.currentDeltaY = chooseRandomDeltaY();
    this.toDeltaY = chooseRandomDeltaY();
    this.speed = Random.float(0.2, 0.8);
    this.segments = makeBuildingFromInstructions(TAIPEI_101);
  }

  move() {
    if (Math.abs(this.toDeltaY - this.currentDeltaY) <= this.speed + 1) {
      this.toDeltaY = chooseRandomDeltaY();
    }
    this.currentDeltaY += Math.sign(this.toDeltaY - this.currentDeltaY) * this.speed;
  }

  draw() {
    // initialize where we are drawing to the bottom of the building
    let drawingY = this.buildingTopPosition.y + this.currentDeltaY + BUILDING_HEIGHT;
    // draw each segment from bottom to top
    this.segments.forEach(s => {
      Canvas.draw(
        this.visual.getContext(),
        s.drawingInstructions,
        {
          // the position of the top center of the segment
          position: {
            x: this.buildingTopPosition.x,
            y: drawingY - s.segmentHeight
          }
        }
      );
      drawingY -= s.segmentHeight; // move to the top of the previously drawn segment
    })
  }
}