import type { DrawingInstructions } from "$lib/canvas";

// segments are drawn from bottom to top
// [0, 0] for a segment is the top center
// each segment should be drawn below (positive)
// the starting point
export type Segment = {
  drawingInstructions: DrawingInstructions;
  segmentHeight: number;
}

// TODO: export function getRandomSegment() {
// }

export enum Cardinality {
  NORTH,
  SOUTH,
  EAST,
  WEST,
};

export function getBuildingCorner(cardinality: Cardinality, distanceFromCenter: number, distanceFromTop = 0): [number, number] {
  switch(cardinality) {
    case Cardinality.NORTH:
      return [0, (-distanceFromCenter / 3) + distanceFromTop];
    case Cardinality.SOUTH:
      return [0, (distanceFromCenter / 3) + distanceFromTop];
    case Cardinality.EAST:
      return [distanceFromCenter, distanceFromTop];
    case Cardinality.WEST:
      return [-distanceFromCenter, distanceFromTop];
  }
};

export const EAST_SHADING = 0.2;
export const WEST_SHADING = 0.4;
