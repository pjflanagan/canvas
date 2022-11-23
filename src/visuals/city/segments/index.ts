import type { DrawingInstructions } from "$lib/canvas";
import type Color from "color";

// segments are drawn from bottom to top
// [0, 0] for a segment is the top center
// each segment should be drawn below the starting point (positive)
export type Segment = {
  drawingInstructions: DrawingInstructions;
  segmentHeight: number;
}

export type SegmentProperties = {
  height?: number;
  color?: Color;
}

export enum Cardinality {
  NORTH,
  NORTH_EAST,
  NORTH_WEST,
  SOUTH,
  SOUTH_EAST,
  SOUTH_WEST,
  EAST,
  WEST,
};

export function getBuildingCornerByCardinality(cardinality: Cardinality, distanceFromCenter: number, distanceFromTop = 0): [number, number] {
  switch(cardinality) {
    case Cardinality.NORTH:
      return [0, (-distanceFromCenter / 3) + distanceFromTop];
    case Cardinality.SOUTH:
      return [0, (distanceFromCenter / 3) + distanceFromTop];
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
};

function getBuildingCornerByAngle(degrees: number, distanceFromCenter: number, distanceFromTop = 0): [number, number] {
  const radians = degrees / 180 * Math.PI;
  return [
    Math.cos(radians) * distanceFromCenter + distanceFromTop,
    Math.sin(radians) * distanceFromCenter / 3 + distanceFromTop
  ];
}

export const EAST_SHADING = 0.2;
export const FRONT_SHADING = 0.3;
export const WEST_SHADING = 0.4;
