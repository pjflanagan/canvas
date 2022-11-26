import Color from 'color';
import {
  Cardinality,
  EAST_SHADING,
  FRONT_SHADING,
  getBuildingCornerByCardinality,
  WEST_SHADING,
  type Segment,
  type SegmentProperties,
} from '../segmentUtils';
import { BUILDING_WIDTH } from '../const';

// TODO: this needs accents along the length of the pyramid
// maybe a pyramid on top that's lit up makeGlowPryramidSpire

export function makePyramidSpire({
  color = Color('#d3ebe5'),
  height = BUILDING_WIDTH,
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
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH, height)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH, height),
            ],
          ],
          fillStyle: color.darken(WEST_SHADING / 2).string(),
        },
        {
          id: 'pyramid-west',
          strokes: [
            ['moveTo', 0, 0],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH, height)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH, height),
            ],
          ],
          fillStyle: color.darken(EAST_SHADING / 2).string(),
        },
      ],
    },
  };
}
