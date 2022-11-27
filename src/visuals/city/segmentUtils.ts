import type { DrawingInstructions } from '$lib/canvas';
import { Random } from '$lib/util';
import Color from 'color';
import { ACCENT_COLORS, BUILDING_WIDTH, PERSPECTIVE, PRIMARY_COLORS } from './const';

// segments are drawn from bottom to top
// [0, 0] for a segment is the top center
// each segment should be drawn below the starting point (positive)
export type Segment = {
  name: string;
  drawingInstructions: DrawingInstructions;
  segmentHeight: number;
  topWidth?: number;
  disallowedNextSegments?: string[];
};

export type SegmentProperties = {
  height?: number;
  color?: Color;
  secondaryColor?: Color;
  rotation?: number;
  stripeCount?: number;
  specialCardinality?: Cardinality;
  topWidth?: number;
  bottomWidth?: number;
  stripePattern?: number[];
};

export function getRandomBaseSegmentProperties(): SegmentProperties {
  return {
    height: Random.float(20, 130),
    color: Color(Random.arrayItem(PRIMARY_COLORS)),
    secondaryColor: Color(Random.arrayItem(ACCENT_COLORS)),
    stripeCount: Random.number(0, 16),
    topWidth: Random.float(2 * BUILDING_WIDTH / 3, BUILDING_WIDTH),
    bottomWidth: Random.float(2 * BUILDING_WIDTH / 3, BUILDING_WIDTH),
  };
}

export function getRandomSegmentProperties(): SegmentProperties {
  return {
    height: Random.float(80, 130),
    color: Color(Random.arrayItem(PRIMARY_COLORS)),
    secondaryColor: Color(Random.arrayItem(ACCENT_COLORS)),
    stripeCount: Random.number(0, 16),
    topWidth: Random.float(2 * BUILDING_WIDTH / 3, BUILDING_WIDTH),
    bottomWidth: Random.float(2 * BUILDING_WIDTH / 3, BUILDING_WIDTH),
    stripePattern: Random.odds(0.8) ? [Random.number(1, 10), Random.number(1, 10)] : [],
  };
}

export function getRandomSpireSegmentProperties(): SegmentProperties {
  return {
    height: Random.float(28, 64),
    color: Color(Random.arrayItem(PRIMARY_COLORS)),
    secondaryColor: Color(Random.arrayItem(ACCENT_COLORS)),
    stripeCount: Random.number(0, 16),
  };
}

// Directions for building corners

export enum Cardinality {
  NORTH,
  NORTH_EAST,
  NORTH_WEST,
  SOUTH,
  SOUTH_EAST,
  SOUTH_WEST,
  EAST,
  WEST,
}

export function getBuildingCornerByCardinality(
  cardinality: Cardinality,
  distanceFromCenter: number,
  distanceFromTop = 0,
): [number, number] {
  switch (cardinality) {
    case Cardinality.NORTH:
      return [0, -distanceFromCenter * PERSPECTIVE + distanceFromTop];
    case Cardinality.SOUTH:
      return [0, distanceFromCenter * PERSPECTIVE + distanceFromTop];
    case Cardinality.EAST:
      return [distanceFromCenter, distanceFromTop];
    case Cardinality.WEST:
      return [-distanceFromCenter, distanceFromTop];
    case Cardinality.SOUTH_EAST:
      return getBuildingCornerByAngle(45, distanceFromCenter, distanceFromTop);
    case Cardinality.SOUTH_WEST:
      return getBuildingCornerByAngle(135, distanceFromCenter, distanceFromTop);
    case Cardinality.NORTH_EAST:
      return getBuildingCornerByAngle(315, distanceFromCenter, distanceFromTop);
    case Cardinality.NORTH_WEST:
      return getBuildingCornerByAngle(225, distanceFromCenter, distanceFromTop);
  }
}

export function getBuildingCornerByAngle(
  degrees: number,
  distanceFromCenter: number,
  distanceFromTop = 0,
): [number, number] {
  const radians = (degrees / 180) * Math.PI;
  return [
    Math.cos(radians) * distanceFromCenter + distanceFromTop,
    Math.sin(radians) * distanceFromCenter * PERSPECTIVE + distanceFromTop,
  ];
}

export function getPointAlongEdge(
  cardinality: Cardinality,
  percentAlong: number,
  buildingWidth: number,
  distanceFromTop = 0,
): [number, number] {
  const sign = cardinality === Cardinality.EAST ? -1 : 1;
  const [x, y] = getBuildingCornerByCardinality(cardinality, buildingWidth);
  return [
    x + sign * percentAlong * buildingWidth,
    distanceFromTop + y + buildingWidth * percentAlong * PERSPECTIVE,
  ];
}

// Colors

export const EAST_SHADING = 0.34;
export const FRONT_SHADING = 0.48;
export const WEST_SHADING = 0.62;
