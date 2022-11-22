import type Color from 'color';
import { Cardinality, EAST_SHADING, getBuildingCorner, WEST_SHADING, type Segment } from ".";
import { BUILDING_WIDTH } from "../const";

export function makeBasicSegment(height: number, color: Color): Segment {
  return {
    segmentHeight: height,
    drawingInstructions: {
      layers: [
        {
          id: 'building-side-west',
          strokes: [
            ['moveTo', ...getBuildingCorner(Cardinality.WEST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCorner(Cardinality.WEST, BUILDING_WIDTH, height)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH, height)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH)],
          ],
          fillStyle: color.darken(WEST_SHADING).string()
        },
        {
          id: 'building-side-east',
          strokes: [
            ['moveTo', ...getBuildingCorner(Cardinality.EAST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCorner(Cardinality.EAST, BUILDING_WIDTH, height)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH, height)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH)],
          ],
          fillStyle: color.darken(EAST_SHADING).string()
        },
        {
          id: 'building-top',
          strokes: [
            ['moveTo', ...getBuildingCorner(Cardinality.NORTH, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCorner(Cardinality.WEST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCorner(Cardinality.EAST, BUILDING_WIDTH)],
          ],
          fillStyle: color.string()
        },
      ]
    }
  }
}