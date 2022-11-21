import { Color, type IColor } from "$lib/util";
import { HALF_BUILDING_PERSPECTIVE_WIDTH, HALF_BUILDING_WIDTH, type Segment } from ".";
import { BUILDING_PERSPECTIVE_WIDTH } from "../const";

export function makeBasicSegment(height: number, color: IColor): Segment {
  return {
    segmentHeight: height,
    drawingInstructions: {
      layers: [
        {
          id: 'building-side-left',
          strokes: [
            ['moveTo', -HALF_BUILDING_WIDTH, HALF_BUILDING_PERSPECTIVE_WIDTH],
            ['lineTo', -HALF_BUILDING_WIDTH, HALF_BUILDING_PERSPECTIVE_WIDTH + height],
            ['lineTo', 0, height + BUILDING_PERSPECTIVE_WIDTH],
            ['lineTo', 0, HALF_BUILDING_PERSPECTIVE_WIDTH],
          ],
          fillStyle: Color.toString(color)
        },
        {
          id: 'building-side-right',
          strokes: [
            ['moveTo', HALF_BUILDING_WIDTH, HALF_BUILDING_PERSPECTIVE_WIDTH],
            ['lineTo', HALF_BUILDING_WIDTH, HALF_BUILDING_PERSPECTIVE_WIDTH + height],
            ['lineTo', 0, height + BUILDING_PERSPECTIVE_WIDTH],
            ['lineTo', 0, HALF_BUILDING_PERSPECTIVE_WIDTH],
          ],
          fillStyle: Color.toString(color) // TODO: make a darker / lighter function 
        },
        {
          id: 'building-top',
          strokes: [
            ['moveTo', 0, 0],
            ['lineTo', -HALF_BUILDING_WIDTH, HALF_BUILDING_PERSPECTIVE_WIDTH],
            ['lineTo', 0, BUILDING_PERSPECTIVE_WIDTH],
            ['lineTo', HALF_BUILDING_WIDTH, HALF_BUILDING_PERSPECTIVE_WIDTH],
          ],
          fillStyle: Color.toString(color) // TODO: make a darker / lighter function 
        },
      ]
    }
  }
}