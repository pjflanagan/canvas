import Color from "color";
import { Cardinality, EAST_SHADING, getBuildingCornerByCardinality, WEST_SHADING, type Segment, type SegmentProperties } from ".";
import { BUILDING_WIDTH } from "../const";

export function makeBasicSegment({ height = 30, color = Color('#70b0b3') }: SegmentProperties): Segment {
  return {
    segmentHeight: height,
    drawingInstructions: {
      layers: [
        {
          id: 'building-side-west',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH, height)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH, height)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH)],
          ],
          fillStyle: color.darken(WEST_SHADING).string()
        },
        {
          id: 'building-side-east',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH, height)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH, height)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH)],
          ],
          fillStyle: color.darken(EAST_SHADING).string()
        },
        {
          id: 'building-top',
          strokes: [
            ['moveTo', ...getBuildingCornerByCardinality(Cardinality.NORTH, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.WEST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.SOUTH, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCornerByCardinality(Cardinality.EAST, BUILDING_WIDTH)],
          ],
          fillStyle: color.string()
        },
      ]
    }
  }
}