import type Color from 'color';
import { Cardinality, EAST_SHADING, getBuildingCorner, WEST_SHADING, type Segment } from ".";
import { BUILDING_WIDTH } from "../const";

export function makeFreedomTowerSegment(height: number, color: Color): Segment {
  return {
    segmentHeight: height,
    drawingInstructions: {
      layers: [
        {
          id: 'segment-west',
          strokes: [
            ['moveTo', ...getBuildingCorner(Cardinality.WEST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH - 10, height)],
            ['lineTo', ...getBuildingCorner(Cardinality.WEST, BUILDING_WIDTH - 10, height)],
          ],
          fillStyle: color.darken(WEST_SHADING).string()
        },
        {
          id: 'segment-east',
          strokes: [
            ['moveTo', ...getBuildingCorner(Cardinality.EAST, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH - 10, height)],
            ['lineTo', ...getBuildingCorner(Cardinality.EAST, BUILDING_WIDTH - 10, height)],
          ],
          fillStyle: color.darken(EAST_SHADING).string()
        },
        {
          id: 'segment-top',
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
