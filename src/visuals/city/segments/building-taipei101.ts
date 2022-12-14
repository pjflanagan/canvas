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

// v2: this can be made with a vertical stripe one (only difference is the outline)
export function makeTaipei101Segment({
  height = 80,
  color = Color('#24e9e2'),
  secondaryColor = Color('#2bd7f6'),
}: SegmentProperties): Segment {
  return {
    name: 'taipei101Segment',
    segmentHeight: height,
    topWidth: BUILDING_WIDTH,
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
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH)],
          ],
          fillStyle: color.darken(WEST_SHADING).string(),
          strokeStyle: secondaryColor.string(),
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
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH)],
          ],
          fillStyle: color.darken(EAST_SHADING).string(),
          strokeStyle: secondaryColor.string(),
        },
        {
          id: 'segment-top',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.NORTH, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.NORTH, BUILDING_WIDTH)],
          ],
          fillStyle: color.string(),
          strokeStyle: secondaryColor.string(),
        },
      ],
    },
  };
}

// v2: this can be made with a vertical stripe one (just remove this when it's done)
export function makeTaipei101Base({
  height = 120,
  color = Color('#70b0b3'),
}: SegmentProperties): Segment {
  return {
    name: 'taipei101Base',
    segmentHeight: height,
    topWidth: BUILDING_WIDTH - 10,
    drawingInstructions: {
      layers: [
        {
          id: 'base-west',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH - 10)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH - 10)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH, height),
            ],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH, height)],
          ],
          fillStyle: color.darken(WEST_SHADING).string(),
        },
        {
          id: 'base-east',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH - 10)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH - 10)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH, height),
            ],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH, height)],
          ],
          fillStyle: color.darken(EAST_SHADING).string(),
        },
        {
          id: 'base-top',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.NORTH, BUILDING_WIDTH - 10)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH - 10)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH - 10)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH - 10)],
          ],
          fillStyle: color.string(),
        },
      ],
    },
  };
}

export function makeTaipei101Spire({ color = Color('#3ff4fb') }: SegmentProperties): Segment {
  const spireBaseStart = 80;
  const spireBaseEnd = spireBaseStart + 40;

  return {
    name: 'taipei101Spire',
    segmentHeight: spireBaseEnd,
    drawingInstructions: {
      layers: [
        {
          id: 'spire-west',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.WEST, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, 8, spireBaseEnd)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, 8, spireBaseEnd)],
          ],
          fillStyle: color.darken(WEST_SHADING).string(),
        },
        {
          id: 'spire-east',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.EAST, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, 8, spireBaseEnd)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, 8, spireBaseEnd)],
          ],
          fillStyle: color.darken(EAST_SHADING).string(),
        },
        {
          id: 'spire-top',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.NORTH, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, 16, spireBaseStart)],
          ],
          fillStyle: color.string(),
        },
        {
          id: 'needle',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.NORTH, 4)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, 4, spireBaseStart)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, 4, spireBaseStart)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, 4, spireBaseStart)],
          ],
          fillStyle: color.string(),
        },
      ],
    },
  };
}
