import Color from 'color';
import {
  Cardinality,
  EAST_SHADING,
  getBuildingCornerByCardinality,
  getPointAlongEdge,
  WEST_SHADING,
  type Segment,
  type SegmentProperties,
} from '../segmentUtils';
import { BUILDING_WIDTH } from '../const';
import type { LayerInstruction } from '$lib/canvas';

// v2: make bottom width take one side or another or both
export function makeVerticalStripedSection({
  height = 30,
  color = Color('#70b0b3'),
  secondaryColor = Color('#000'),
  stripeCount = 10,
  topWidth = BUILDING_WIDTH,
  bottomWidth = BUILDING_WIDTH,
  stripePattern = [],
  forceBox = false
}: SegmentProperties): Segment {
  const activeTopWidth = forceBox ? bottomWidth : topWidth;
  return {
    name: 'verticalStripedSection',
    segmentHeight: height,
    topWidth: topWidth,
    drawingInstructions: {
      layers: [
        {
          id: 'building-side-west',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.WEST, activeTopWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, bottomWidth, height)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, bottomWidth, height),
            ],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, activeTopWidth)],
          ],
          fillStyle: color.darken(WEST_SHADING).string(),
        },
        {
          id: 'building-side-east',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.EAST, activeTopWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, bottomWidth, height)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, bottomWidth, height),
            ],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, activeTopWidth)],
          ],
          fillStyle: color.darken(EAST_SHADING).string(),
        },
        ...[...Array(stripeCount).keys()].map((i: number): LayerInstruction => {
          return {
            id: `bar-east-${i}`,
            strokes: [
              ['moveTo', ...getPointAlongEdge(Cardinality.EAST, i / stripeCount, activeTopWidth)],
              ['lineTo', ...getPointAlongEdge(Cardinality.EAST, i / stripeCount, bottomWidth, height)],
            ],
            strokeStyle: secondaryColor.string(),
            lineDash: stripePattern,
          };
        }),
        ...[...Array(stripeCount + 1).keys()].map((i: number): LayerInstruction => {
          return {
            id: `bar-west-${i}`,
            strokes: [
              ['moveTo', ...getPointAlongEdge(Cardinality.WEST, i / stripeCount, activeTopWidth)],
              ['lineTo', ...getPointAlongEdge(Cardinality.WEST, i / stripeCount, bottomWidth, height)],
            ],
            strokeStyle: secondaryColor.string(),
            lineDash: stripePattern
          };
        }),
        {
          id: 'building-top',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.NORTH, activeTopWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, activeTopWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, activeTopWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, activeTopWidth)],
          ],
          fillStyle: color.toString(),
        },
      ],
    },
  };
}
