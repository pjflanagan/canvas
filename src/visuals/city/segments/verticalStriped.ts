import Color from 'color';
import {
  Cardinality,
  EAST_SHADING,
  getBuildingCornerByAngle,
  getBuildingCornerByCardinality,
  getPointAlongEdge,
  WEST_SHADING,
  type Segment,
  type SegmentProperties,
} from '../segmentUtils';
import { BUILDING_WIDTH, PERSPECTIVE } from '../const';
import type { LayerInstruction } from '$lib/canvas';

export function makeVerticalStripedSection({
  height = 30,
  color = Color('#70b0b3'),
  secondaryColor = Color('#000'),
  stripeCount = 10,
}: SegmentProperties): Segment {
  return {
    name: 'verticalStripedSection',
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
            id: `bar-east-${i}`,
            strokes: [
              ['moveTo', ...getPointAlongEdge(Cardinality.EAST, i / stripeCount)],
              ['lineTo', ...getPointAlongEdge(Cardinality.EAST, i / stripeCount, height)],
            ],
            strokeStyle: secondaryColor.string(),
          };
        }),
        ...[...Array(stripeCount + 1).keys()].map((i: number): LayerInstruction => {
          return {
            id: `bar-west-${i}`,
            strokes: [
              ['moveTo', ...getPointAlongEdge(Cardinality.WEST, i / stripeCount)],
              ['lineTo', ...getPointAlongEdge(Cardinality.WEST, i / stripeCount, height)],
            ],
            strokeStyle: secondaryColor.darken(WEST_SHADING).string(),
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
