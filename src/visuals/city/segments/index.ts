import type { DrawingInstructions } from "$lib/canvas";
import { BUILDING_PERSPECTIVE_WIDTH, BUILDING_WIDTH } from "../const";

export const HALF_BUILDING_PERSPECTIVE_WIDTH = BUILDING_PERSPECTIVE_WIDTH / 2;
export const HALF_BUILDING_WIDTH = BUILDING_WIDTH / 2;

// segments are drawn from bottom to top
// [0, 0] for a segment is the top center
// each segment should be drawn below (positive)
// the starting point
export type Segment = {
  drawingInstructions: DrawingInstructions;
  segmentHeight: number;
}

// TODO: export getRandomSegment() {
// }

