/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Random } from '$lib/util';
import Color from 'color';
import { ACCENT_COLORS, BUILDING_HEIGHT, PRIMARY_COLORS } from './const';
import {
  getRandomBaseSegmentProperties,
  getRandomSegmentProperties,
  getRandomSpireSegmentProperties,
  type Segment,
} from './segmentUtils';
import { makeBasicSegment } from './segments/segment-basic';
import { makeFreedomTowerSegment, makeFreedomTowerSpire } from './segments/building-freedomTower';
import { makeTaipei101Base, makeTaipei101Segment, makeTaipei101Spire } from './segments/building-taipei101';
import { makeHorizontalStripedSegment } from './segments/segment-horizontalStripe';
import { makeVerticalStripedSection } from './segments/segment-verticalStripe';
import { makePyramidSpire } from './segments/spire-pyramid';
import { makeRecessedBottomSegment, makeRecessedTopSegment } from './segments/segment-recessed';

// Random building

export const SEGMENTS = [
  // makeBasicSegment,
  makeVerticalStripedSection,
  makeHorizontalStripedSegment,
  makeTaipei101Segment,
  // makeRecessedBottomSegment,
];

export const FINAL_SEGMENT = [
  ...SEGMENTS,
  makeFreedomTowerSegment,
  // makeRecessedTopSegment,
];

export const SPIRES = [makeTaipei101Spire, makeFreedomTowerSpire, makePyramidSpire];

export const BASES = [
  makeBasicSegment,
  makeVerticalStripedSection,
  makeHorizontalStripedSegment,
  makeTaipei101Base,
];

export function makeRandomBuildingSegments(): Segment[] {
  const { color, secondaryColor, stripePattern, stripeCount } = getRandomSegmentProperties();

  const buildingSegments: Segment[] = [];

  // push a base segment
  buildingSegments.push(
    Random.arrayItem(BASES)!({
      ...getRandomBaseSegmentProperties(),
      color,
      secondaryColor,
    }),
  );

  let buildingHeight = buildingSegments.length > 0 ? buildingSegments[0].segmentHeight : 0;
  while (buildingHeight < BUILDING_HEIGHT) {
    // recall the previous segment
    const { disallowedNextSegments, topWidth: previousSegmentTopWidth } = buildingSegments[buildingSegments.length - 1];

    // get random segment properties
    const segmentProperties = getRandomSegmentProperties();
    const isFinalSegment = segmentProperties.height! + buildingHeight > BUILDING_HEIGHT;

    // chose a different segment type if this is the last segment
    const segmentOptions = isFinalSegment ? FINAL_SEGMENT : SEGMENTS;
    // remove any segment that cannot follow the previous segment
    const allowedNextSegments = !disallowedNextSegments
      ? segmentOptions
      : segmentOptions.filter(s => !disallowedNextSegments.includes(s.name));

    // randomly make the bottom width the same as the previous segment's top width
    // maybe sometimes force it if the bottom is bigger (segmentProperties.bottomWidth! > previousSegmentTopWidth!)
    if (Random.odds(0.3)) {
      segmentProperties.bottomWidth = previousSegmentTopWidth;
    }

    // get a random segment with these properties
    const segment = Random.arrayItem(allowedNextSegments)!({
      ...segmentProperties,
      color,
      secondaryColor,
      stripePattern,
      stripeCount,
    });

    // add it to the building segments and record the building height
    buildingSegments.push(segment);
    buildingHeight += segment.segmentHeight;
  }

  // then push a spire if that's allowed
  const previousSegment = buildingSegments[buildingSegments.length - 1];
  if (!previousSegment.disallowSpire && Random.odds(0.3)) {
    const disallowedNextSegments = previousSegment.disallowedNextSegments;
    const allowedSpires = !disallowedNextSegments
      ? SPIRES
      : SPIRES.filter(s => !disallowedNextSegments.includes(s.name));
    const spire = Random.arrayItem(allowedSpires)!({
      ...getRandomSpireSegmentProperties(),
      color,
      secondaryColor,
      bottomWidth: previousSegment.topWidth
    });
    if (!disallowedNextSegments || !disallowedNextSegments.includes(spire.name)) {
      buildingSegments.push(spire);
    }
  }

  return buildingSegments;
}

// Building instructions

export type BuildingInstructions = {
  base?: Segment;
  top?: Segment;
  buildingPattern: Segment[];
};

export function makeBuildingFromInstructions(
  buildingInstructions: BuildingInstructions,
): Segment[] {
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

// Specific buildings

export const TAIPEI_101: BuildingInstructions = {
  top: makeTaipei101Spire({}),
  base: makeTaipei101Base({}),
  buildingPattern: [
    makeTaipei101Segment({}),
    makeBasicSegment({ height: 4, color: Color('#083060') }),
  ],
};

export const FREEDOM_TOWER: BuildingInstructions = {
  top: makeFreedomTowerSpire({}),
  base: makeVerticalStripedSection({
    height: 80,
    color: Color('#94afb0'),
    secondaryColor: Color('#94afb0').darken(0.4),
    stripeCount: 16,
  }),
  buildingPattern: [makeFreedomTowerSegment({})],
};
