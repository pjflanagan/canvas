/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Random } from "$lib/util";
import Color from "color";
import { ACCENT_COLORS, BUILDING_HEIGHT, PRIMARY_COLORS } from "./const";
import { getRandomBaseSegmentProperties, getRandomSegmentProperties, getRandomSpireSegmentProperties, type Segment } from "./segmentUtils";
import { makeBasicSegment } from "./segments/basic";
import { makeFreedomTowerSegment, makeFreedomTowerSpire } from "./segments/freedomTower";
import { makeTaipei101Base, makeTaipei101Segment, makeTaipei101Spire } from "./segments/taipei101";
import { makeHorizontalStripedSegment } from "./segments/horizontalStriped";
import { makeVerticalStripedSection } from "./segments/verticalStriped";
import { makePyramidSpire } from "./segments/pyramid";

// Random building

export const SEGMENTS = [
  makeBasicSegment,
  makeVerticalStripedSection,
  makeHorizontalStripedSegment,
  makeTaipei101Segment,
];

export const FINAL_SEGMENT = [
  ...SEGMENTS,
  makeFreedomTowerSegment,
];

export const SPIRES = [
  makeTaipei101Spire,
  makeFreedomTowerSpire,
  makePyramidSpire,
];

export const BASES = [
  makeBasicSegment,
  makeVerticalStripedSection,
  makeHorizontalStripedSegment,
  makeTaipei101Base
];

// TODO: this needs some work to make them pretty
// some segments don't look good with others
// maybe some buildings should be all one thing
// with a random base and a random top
// or maybe
// some type of patterning system where we pick two and pair them
export function makeRandomBuildingSegments(): Segment[] {

  const color = Color(Random.arrayItem(PRIMARY_COLORS));
  const secondaryColor = Color(Random.arrayItem(ACCENT_COLORS));

  const buildingSegments: Segment[] = [];

  // push a base segment
  // if (Random.boolean()) {
  buildingSegments.push(
    Random.arrayItem(BASES)!({
      ...getRandomBaseSegmentProperties(),
      color,
      secondaryColor,
    })
  );
  // }

  let buildingHeight = buildingSegments.length > 0 ? buildingSegments[0].segmentHeight : 0;
  while (buildingHeight < BUILDING_HEIGHT) {
    const segmentProperties = getRandomSegmentProperties();
    const isFinalSegment = segmentProperties.height! + buildingHeight > BUILDING_HEIGHT;
    const segment = (
      Random.arrayItem(isFinalSegment ? FINAL_SEGMENT : SEGMENTS)!)({
        ...segmentProperties,
        color,
        secondaryColor,
      });
    buildingSegments.push(segment);
    buildingHeight += segment.segmentHeight;
  }

  // then push a top segment
  if (Random.odds(0.3)) {
    buildingSegments.push(
      Random.arrayItem(SPIRES)!({
        ...getRandomSpireSegmentProperties(),
        color: secondaryColor,
        secondaryColor,
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
  top: makeFreedomTowerSpire({}),
  base: makeVerticalStripedSection({
      height: 80,
      color: Color('#94afb0'),
      secondaryColor: Color('#94afb0').darken(0.4),
      stripeCount: 16,
  }),
  buildingPattern: [
    makeFreedomTowerSegment({}),
  ],
}
