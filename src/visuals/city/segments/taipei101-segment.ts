import { Color, type IColor } from "$lib/util";
import { HALF_BUILDING_PERSPECTIVE_WIDTH, HALF_BUILDING_WIDTH, type Segment } from ".";
import { BUILDING_PERSPECTIVE_WIDTH } from "../const";

// 80 looks good
export function makeTaipei101Segment(height: number, color: IColor): Segment {
  const segmentHeight = height - HALF_BUILDING_PERSPECTIVE_WIDTH + 4;
  if (segmentHeight < 0) {
    throw 'Cannot make negative height segment';
  }
  return {
    segmentHeight: segmentHeight,
    drawingInstructions: {
      layers: [
        {
          id: 'building-side-left',
          strokes: [
            ['moveTo', -HALF_BUILDING_WIDTH, HALF_BUILDING_PERSPECTIVE_WIDTH],
            ['lineTo', -HALF_BUILDING_WIDTH + 8, height],
            ['lineTo', 0, height + HALF_BUILDING_PERSPECTIVE_WIDTH],
            ['lineTo', 0, HALF_BUILDING_PERSPECTIVE_WIDTH],
          ],
          fillStyle: Color.toString(color)
        },
        {
          id: 'building-side-right',
          strokes: [
            ['moveTo', HALF_BUILDING_WIDTH, HALF_BUILDING_PERSPECTIVE_WIDTH],
            ['lineTo', HALF_BUILDING_WIDTH - 8, height],
            ['lineTo', 0, height + HALF_BUILDING_PERSPECTIVE_WIDTH],
            ['lineTo', 0, HALF_BUILDING_PERSPECTIVE_WIDTH],
          ],
          fillStyle: Color.toString(color)
        },
        {
          id: 'building-top',
          strokes: [
            ['moveTo', 0, 0],
            ['lineTo', -HALF_BUILDING_WIDTH, HALF_BUILDING_PERSPECTIVE_WIDTH],
            ['lineTo', 0, BUILDING_PERSPECTIVE_WIDTH],
            ['lineTo', HALF_BUILDING_WIDTH, HALF_BUILDING_PERSPECTIVE_WIDTH],
          ],
          fillStyle: Color.toString(color)
        },
      ]
    }
  }
}

// export function makeTaipei101Base(color: IColor): Segment {

// }

export function makeTaipei101Spire(color: IColor): Segment {
  const spireLength = 80;
  const spireBaseLength = 20;
  const spireHeight = spireLength + spireBaseLength;

  return {
    segmentHeight: spireHeight,
    drawingInstructions: {
      layers: [
        {
          id: 'spire-base-left',
          strokes: [
            ['moveTo', -16, spireLength + 4],
            ['lineTo', -2, spireHeight + 4],
            ['lineTo', 0, spireHeight + 8],
            ['lineTo', 0, spireLength + 8],
          ],
          fillStyle: Color.toString(color)
        },
        {
          id: 'spire-base-right',
          strokes: [
            ['moveTo', 16, spireLength + 4],
            ['lineTo', 2, spireHeight + 4],
            ['lineTo', 0, spireHeight + 8],
            ['lineTo', 0, spireLength + 8],
          ],
          fillStyle: Color.toString(color)
        },
        {
          id: 'spire-base-top',
          strokes: [
            ['moveTo', 0, spireLength],
            ['lineTo', -16, spireLength + 4],
            ['lineTo', 0, spireLength + 8],
            ['lineTo', 16, spireLength + 4],
          ],
          fillStyle: Color.toString(color)
        },
        // {
        //   id: 'needle',
        //   strokes: [
        //     ['moveTo', 0, 0],
        //     ['lineTo', -HALF_BUILDING_WIDTH, HALF_BUILDING_PERSPECTIVE_WIDTH],
        //     ['lineTo', 0, BUILDING_PERSPECTIVE_WIDTH],
        //     ['lineTo', HALF_BUILDING_WIDTH, HALF_BUILDING_PERSPECTIVE_WIDTH],
        //   ],
        //   fillStyle: Color.toString(color)
        // },
      ]
    }
  }
}