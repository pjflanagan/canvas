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

// TODO:

export function makeRecessedTopSegment({
  height = 30,
  color = Color('#70b0b3'),
  secondaryColor = Color('#000'),
  stripeCount = 10,
  // topWidth = BUILDING_WIDTH,
  bottomWidth = BUILDING_WIDTH,
  stripePattern = [],
  accentSide = Cardinality.SOUTH_WEST,
  accentWidth = 10,
}: SegmentProperties): Segment {
  const normalWidth = bottomWidth;
  const recessedWidth = accentWidth;
  return {
    name: 'recessedTopSegment',
    disallowSpire: true,
    segmentHeight: height,
    topWidth: accentWidth,
    drawingInstructions: {
      layers: [
        {
          id: 'building-side-west',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.WEST, accentSide === Cardinality.SOUTH_WEST ? recessedWidth : normalWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, normalWidth, height)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, normalWidth, height),
            ],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, accentSide === Cardinality.SOUTH_WEST ? recessedWidth : normalWidth)],
          ],
          fillStyle: color.darken(WEST_SHADING).string(),
        },
        {
          id: 'building-side-east',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.EAST, accentSide === Cardinality.SOUTH_EAST ? recessedWidth : normalWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, normalWidth, height)],
            [
              'lineTo',
              ...getBuildingCornerByCardinality(Cardinality.SOUTH, normalWidth, height),
            ],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, accentSide === Cardinality.SOUTH_EAST ? recessedWidth : normalWidth)],
          ],
          fillStyle: color.darken(EAST_SHADING).string(),
        },
        ...[...Array(stripeCount).keys()].map((i: number): LayerInstruction => {
          return {
            id: `bar-east-${i}`,
            strokes: [
              ['moveTo', ...getPointAlongEdge(Cardinality.EAST, i / stripeCount, accentSide === Cardinality.SOUTH_EAST ? recessedWidth : normalWidth)],
              ['lineTo', ...getPointAlongEdge(Cardinality.EAST, i / stripeCount, normalWidth, height)],
            ],
            strokeStyle: secondaryColor.string(),
            lineDash: stripePattern,
          };
        }),
        ...[...Array(stripeCount + 1).keys()].map((i: number): LayerInstruction => {
          return {
            id: `bar-west-${i}`,
            strokes: [
              ['moveTo', ...getPointAlongEdge(Cardinality.WEST, i / stripeCount, accentSide === Cardinality.SOUTH_WEST ? recessedWidth : normalWidth)],
              ['lineTo', ...getPointAlongEdge(Cardinality.WEST, i / stripeCount, normalWidth, height)],
            ],
            strokeStyle: secondaryColor.string(),
            lineDash: stripePattern
          };
        }),
        {
          id: 'building-top',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.NORTH, accentSide === Cardinality.NORTH_EAST || accentSide === Cardinality.NORTH_WEST ? recessedWidth : normalWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, accentSide === Cardinality.NORTH_WEST || accentSide === Cardinality.SOUTH_WEST ? recessedWidth : normalWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, accentSide === Cardinality.SOUTH_EAST || accentSide === Cardinality.SOUTH_WEST ? recessedWidth : normalWidth)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, accentSide === Cardinality.NORTH_EAST || accentSide === Cardinality.SOUTH_EAST ? recessedWidth : normalWidth)],
          ],
          fillStyle: color.toString(),
        },
      ],
    },
  };
}

export function makeRecessedBottomSegment({
  height = 30,
  color = Color('#70b0b3'),
  secondaryColor = Color('#000'),
  stripeCount = 10,
  topWidth = BUILDING_WIDTH,
  bottomWidth = BUILDING_WIDTH,
  stripePattern = [],
  accentSide = Cardinality.SOUTH_WEST
}: SegmentProperties): Segment {
  return {
    name: 'recessedTopSegment',
    disallowSpire: true,
    segmentHeight: height,
    topWidth: topWidth,
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
          return {
            id: `bar-east-${i}`,
            strokes: [
              ['moveTo', ...getPointAlongEdge(Cardinality.EAST, i / stripeCount, topWidth)],
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
              ['moveTo', ...getPointAlongEdge(Cardinality.WEST, i / stripeCount, topWidth)],
              ['lineTo', ...getPointAlongEdge(Cardinality.WEST, i / stripeCount, bottomWidth, height)],
            ],
            strokeStyle: secondaryColor.string(),
            lineDash: stripePattern
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