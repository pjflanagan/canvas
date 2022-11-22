import type Color from 'color';
import { Cardinality, EAST_SHADING, getBuildingCorner, WEST_SHADING, type Segment } from ".";
import { BUILDING_WIDTH } from "../const";

export function makeTaipei101Segment(height: number, color: Color): Segment {
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

export function makeTaipei101Base(height: number, color: Color): Segment {
  return {
    segmentHeight: height,
    drawingInstructions: {
      layers: [
        {
          id: 'base-west',
          strokes: [
            ['moveTo', ...getBuildingCorner(Cardinality.WEST, BUILDING_WIDTH- 10)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH- 10)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH, height)],
            ['lineTo', ...getBuildingCorner(Cardinality.WEST, BUILDING_WIDTH, height)],
          ],
          fillStyle: color.darken(WEST_SHADING).string()
        },
        {
          id: 'base-east',
          strokes: [
            ['moveTo', ...getBuildingCorner(Cardinality.EAST, BUILDING_WIDTH- 10)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH- 10)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH, height)],
            ['lineTo', ...getBuildingCorner(Cardinality.EAST, BUILDING_WIDTH, height)],
          ],
          fillStyle: color.darken(EAST_SHADING).string()
        },
        {
          id: 'base-top',
          strokes: [
            ['moveTo', ...getBuildingCorner(Cardinality.NORTH, BUILDING_WIDTH - 10)],
            ['lineTo', ...getBuildingCorner(Cardinality.WEST, BUILDING_WIDTH - 10)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, BUILDING_WIDTH - 10)],
            ['lineTo', ...getBuildingCorner(Cardinality.EAST, BUILDING_WIDTH - 10)],
          ],
          fillStyle: color.string()
        },
      ]
    }
  }
}

export function makeTaipei101Spire(color: Color): Segment {
  const spireBaseStart = 80;
  const spireBaseEnd = spireBaseStart + 40;

  return {
    segmentHeight: spireBaseEnd,
    drawingInstructions: {
      layers: [
        {
          id: 'spire-west',
          strokes: [
            ['moveTo', ...getBuildingCorner(Cardinality.WEST, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, 8, spireBaseEnd)],
            ['lineTo', ...getBuildingCorner(Cardinality.WEST, 8, spireBaseEnd)],
          ],
          fillStyle: color.darken(WEST_SHADING).string()
        },
        {
          id: 'spire-east',
          strokes: [
            ['moveTo', ...getBuildingCorner(Cardinality.EAST, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, 8, spireBaseEnd)],
            ['lineTo', ...getBuildingCorner(Cardinality.EAST, 8, spireBaseEnd)],
          ],
          fillStyle: color.darken(EAST_SHADING).string()
        },
        {
          id: 'spire-top',
          strokes: [
            ['moveTo', ...getBuildingCorner(Cardinality.NORTH, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCorner(Cardinality.WEST, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, 16, spireBaseStart)],
            ['lineTo', ...getBuildingCorner(Cardinality.EAST, 16, spireBaseStart)],
          ],
          fillStyle: color.string()
        },
        {
          id: 'needle',
          strokes: [
            ['moveTo', ...getBuildingCorner(Cardinality.NORTH, 4)],
            ['lineTo', ...getBuildingCorner(Cardinality.WEST, 4, spireBaseStart)],
            ['lineTo', ...getBuildingCorner(Cardinality.SOUTH, 4, spireBaseStart)],
            ['lineTo', ...getBuildingCorner(Cardinality.EAST, 4, spireBaseStart)],
          ],
          fillStyle: color.string()
        },
      ]
    }
  }
}