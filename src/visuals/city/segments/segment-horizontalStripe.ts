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
import type { LayerInstruction } from '$lib/canvas';

export function makeHorizontalStripedSegment({
  height = 30,
  color = Color('#70b0b3'),
  secondaryColor = Color('#000'),
  stripeCount = 10,
  stripePattern = [],
  // topWidth = BUILDING_WIDTH,
  // bottomWidth = BUILDING_WIDTH
}: SegmentProperties): Segment {
  return {
    name: 'horizontalStripedSegment',
    segmentHeight: height,
    drawingInstructions: {
      layers: [
        {
          id: 'building-side-west',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH, height)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH, height),
            ],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH)],
          ],
          fillStyle: color.darken(WEST_SHADING).string(),
        },
        {
          id: 'building-side-east',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH, height)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH, height),
            ],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH)],
          ],
          fillStyle: color.darken(EAST_SHADING).string(),
        },
        ...[...Array(stripeCount).keys()].map((i: number): LayerInstruction => {
          return {
            id: `bar-${i}`,
            strokes: [
              [
                'moveTo',
                ...getBuildingCornerByCardinality(
                  Cardinality.EAST,
                  BUILDING_WIDTH,
                  (i / stripeCount) * height,
                ),
              ],
              [
                'lineTo',
                ...getBuildingCornerByCardinality(
                  Cardinality.SOUTH,
                  BUILDING_WIDTH,
                  (i / stripeCount) * height,
                ),
              ],
              [
                'lineTo',
                ...getBuildingCornerByCardinality(
                  Cardinality.WEST,
                  BUILDING_WIDTH,
                  (i / stripeCount) * height,
                ),
              ],
            ],
            strokeStyle: secondaryColor.string(),
            lineDash: stripePattern,
          };
        }),
        {
          id: 'building-top',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.NORTH, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH)],
          ],
          fillStyle: color.toString(),
        },
      ],
    },
  };
}
