import Color from "color";
import { Cardinality, EAST_SHADING, FRONT_SHADING, getBuildingCornerByCardinality, WEST_SHADING, type Segment, type SegmentProperties } from ".";
import { BUILDING_WIDTH } from "../const";

export function makeFreedomTowerSegment({ height = 480, color = Color('#24e9e2') }: SegmentProperties): Segment {
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
