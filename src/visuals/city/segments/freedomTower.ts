import Color from "color";
import { Cardinality, EAST_SHADING, FRONT_SHADING, getBuildingCornerByCardinality, WEST_SHADING, type Segment, type SegmentProperties } from "../segmentUtils";
import { BUILDING_WIDTH } from "../const";

export function makeFreedomTowerSegment({ height = 480, color = Color('#2ba5b5') }: SegmentProperties): Segment {
  return {
    segmentHeight: height,
    drawingInstructions: {
      layers: [
        {
          id: 'segment-left',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH_WEST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH, height)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH, height)],
          ],
          fillStyle: color.darken(WEST_SHADING).string()
        },
        {
          id: 'segment-front',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH_WEST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH, height)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH_EAST, BUILDING_WIDTH)],
          ],
          fillStyle: color.darken(FRONT_SHADING).string()
        },
        {
          id: 'segment-right',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH_EAST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH, height)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH, height)],
          ],
          fillStyle: color.darken(EAST_SHADING).string()
        },
        {
          id: 'segment-top',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH_WEST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH_EAST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.NORTH_EAST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.NORTH_WEST, BUILDING_WIDTH)],
          ],
          fillStyle: color.string()
        },
      ]
    }
  }
}

export function makeFreedomTowerSpire({ color = Color('#d3ebe5') }: SegmentProperties): Segment {
  const spireBaseStart = 120;
  const spireBaseEnd = spireBaseStart + 10;

  return {
    segmentHeight: spireBaseEnd,
    drawingInstructions: {
      layers: [
        {
          id: 'circle-bottom',
          strokes: [
            ['ellipse', 0, spireBaseEnd, 6 * 3, 6, 0, 2 * Math.PI, 0, false,],
          ],
          fillStyle: color.darken(0.1).string()
        },
        {
          id: 'circle-length',
          strokes: [
            ['rect', -6 * 3, spireBaseStart, 6 * 6, 10],
          ],
          fillStyle: color.darken(0.1).string()
        },
        {
          id: 'circle-top',
          strokes: [
            ['ellipse', 0, spireBaseStart, 6 * 3, 6, 0, 2 * Math.PI, 0, false,],
          ],
          fillStyle: color.string()
        },
        {
          id: 'needle',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.NORTH, 4)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, 4, spireBaseStart)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, 4, spireBaseStart)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, 4, spireBaseStart)],
          ],
          fillStyle: color.string()
        },
      ]
    }
  }
}