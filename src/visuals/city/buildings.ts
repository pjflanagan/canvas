/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Random } from "$lib/util";
import Color from "color";
import { BUILDING_HEIGHT } from "./const";
import type { Segment } from "./segments";
import { makeBasicSegment } from "./segments/basic-segment";
import { makeFreedomTowerSegment } from "./segments/freedomTower-segment";
import { makeTaipei101Base, makeTaipei101Segment, makeTaipei101Spire } from "./segments/taipei101-segment";

// Random building

export const SEGMENTS = [
  makeBasicSegment,
  makeTaipei101Segment,
  makeFreedomTowerSegment
];

export const SPIRES = [
  makeTaipei101Spire
];

export const BASES = [
  makeBasicSegment,
  makeTaipei101Base
];

export function makeRandomBuildingSegments(): Segment[] {
  const buildingSegments: Segment[] = [];

  // push a bunch of base segment
  if (Random.boolean()) {
    buildingSegments.push(Random.arrayItem(BASES)!({
      height: Random.float(28, 64),
    }));
  }

  let buildingHeight = buildingSegments.length > 0 ? buildingSegments[0].segmentHeight : 0;
  while (buildingHeight < BUILDING_HEIGHT) {
    const segment = (Random.arrayItem(SEGMENTS)!)({
      height: Random.float(28, 64)
    });
    buildingSegments.push(segment);
    buildingHeight += segment.segmentHeight;
  }

  // then push a top segment
  if (Random.boolean()) {
    buildingSegments.push(Random.arrayItem(SPIRES)!({
      height: Random.float(28, 64),
    }));
  }

  return buildingSegments;
}

// Building instructions

export type BuildingInstructions = {
  base?: Segment;
  top?: Segment;
  buildingPattern: Segment[];
}

export function makeBuildingFromInstructions(buildingInstructions: BuildingInstructions): Segment[] {
  const buildingSegments: Segment[] = [];
  let buildingHeight = 0;
  
  if (buildingInstructions.base) {
    buildingSegments.push(buildingInstructions.base);
  }
  while (buildingHeight < BUILDING_HEIGHT) {
    buildingInstructions.buildingPattern.forEach((segment: Segment) => {
      buildingSegments.push(segment);
      buildingHeight += segment.segmentHeight;
    });
  }
  if (buildingInstructions.top) {
    buildingSegments.push(buildingInstructions.top);
  }

  return buildingSegments;
}

export const TAIPEI_101: BuildingInstructions = {
  top: makeTaipei101Spire({}),
  base: makeTaipei101Base({}),
  buildingPattern: [
    makeTaipei101Segment({}),
    makeBasicSegment({ height: 4, color: Color('#083060') }),
  ],
}

export const FREEDOM_TOWER: BuildingInstructions = {
  base: makeBasicSegment({ height: 80, color: Color('#70b0b3')}),
  buildingPattern: [
    makeFreedomTowerSegment({}),
  ],
}
