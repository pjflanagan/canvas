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
  topWidth = BUILDING_WIDTH,
  bottomWidth = BUILDING_WIDTH
}: SegmentProperties): Segment {
  return {
    name: 'horizontalStripedSegment',
    segmentHeight: height,
    drawingInstructions: {
      layers: [
        {
          id: 'building-side-west',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.WEST, topWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, bottomWidth, height)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, bottomWidth, height),
            ],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, topWidth)],
          ],
          fillStyle: color.darken(WEST_SHADING).string(),
        },
        {
          id: 'building-side-east',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.EAST, topWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, bottomWidth, height)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, bottomWidth, height),
            ],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, topWidth)],
          ],
          fillStyle: color.darken(EAST_SHADING).string(),
        },
        ...[...Array(stripeCount).keys()].map((i: number): LayerInstruction => {
          const stripeHeight = (i / stripeCount) * height;
          const rate = bottomWidth - topWidth;
          const stripeWidth = topWidth + rate * (i / stripeCount);
          return {
            id: `bar-${i}`,
            strokes: [
              [
                'moveTo',
                ...getBuildingCornerByCardinality(
                  Cardinality.EAST,
                  stripeWidth,
                  stripeHeight,
                ),
              ],
              [
                'lineTo',
                ...getBuildingCornerByCardinality(
                  Cardinality.SOUTH,
                  stripeWidth,
                  stripeHeight,
                ),
              ],
              [
                'lineTo',
                ...getBuildingCornerByCardinality(
                  Cardinality.WEST,
                  stripeWidth,
                  stripeHeight,
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
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.NORTH, topWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, topWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, topWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, topWidth)],
          ],
          fillStyle: color.toString(),
        },
      ],
    },
  };
}
