import { Canvas } from "$lib/canvas";
import { Random, type Point } from "$lib/util";
import { makeBuildingFromInstructions, makeRandomBuildingSegments, type BuildingInstructions } from "./buildings"; // makeRandomBuildingSegments
import type { CityVisual } from "./CityVisual";
import { BUILDING_HEIGHT } from "./const";
import type { Segment } from "./segmentUtils";

function chooseRandomDeltaY(): number {
  return Random.number(-18, 18);
}

export class Building {
  visual: CityVisual;
  buildingTopPosition: Point;
  currentDeltaY: number;
  toDeltaY: number;
  speed: number;
  segments: Segment[];

  constructor(visual: CityVisual, buildingTopPosition: Point, instructions?: BuildingInstructions) {
    this.visual = visual;
    this.buildingTopPosition = buildingTopPosition;
    this.currentDeltaY = chooseRandomDeltaY();
    this.toDeltaY = chooseRandomDeltaY();
    this.speed = Random.float(0.2, 0.8);
    this.segments = instructions ? makeBuildingFromInstructions(instructions) : makeRandomBuildingSegments();
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

  remakeBuildingFromInstructions(instructions: BuildingInstructions) {
    this.segments = makeBuildingFromInstructions(instructions);
  }
}