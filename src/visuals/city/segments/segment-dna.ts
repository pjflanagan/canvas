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

// TODO: make 2 of these
export function makeClockwiseDNASegment({
  height = 80,
  color = Color('#24e9e2'),
}: SegmentProperties): Segment {
  return {
    name: 'dnaSegment',
    segmentHeight: height,
    drawingInstructions: {
      layers: [
        {
          id: 'segment-west',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH - 10, height),
            ],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH - 10, height),
            ],
          ],
          fillStyle: color.darken(WEST_SHADING).string(),
        },
        {
          id: 'segment-east',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH - 10, height),
            ],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH - 10, height),
            ],
          ],
          fillStyle: color.darken(EAST_SHADING).string(),
        },
        {
          id: 'segment-top',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.NORTH, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH)],
          ],
          fillStyle: color.string(),
        },
      ],
    },
  };
}
