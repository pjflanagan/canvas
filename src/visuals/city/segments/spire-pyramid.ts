import Color from 'color';
import {
  Cardinality,
  EAST_SHADING,
  getBuildingCornerByCardinality,
  WEST_SHADING,
  type Segment,
  type SegmentProperties,
} from '../segmentUtils';
import { BUILDING_WIDTH } from '../const';

// v2: this needs accents along the length of the pyramid
// maybe a pyramid on top that's lit up makeGlowPryramidSpire
export function makePyramidSpire({
  color = Color('#d3ebe5'),
  height = BUILDING_WIDTH,
  bottomWidth = BUILDING_WIDTH,
}: SegmentProperties): Segment {
  return {
    name: 'pyramidSpire',
    segmentHeight: height,
    drawingInstructions: {
      layers: [
        {
          id: 'pyramid-west',
          strokes: [
            ['moveTo', 0, 0],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, bottomWidth, height)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, bottomWidth, height),
            ],
          ],
          fillStyle: color.darken(WEST_SHADING / 2).string(),
        },
        {
          id: 'pyramid-west',
          strokes: [
            ['moveTo', 0, 0],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, bottomWidth, height)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, bottomWidth, height),
            ],
          ],
          fillStyle: color.darken(EAST_SHADING / 2).string(),
        },
      ],
    },
  };
}
