import { Canvas, type DrawingInstructions } from "$lib/canvas";
import { Color, Geometry, Random, type IColor, type Point } from "$lib/util";
import { Member } from "./Member";
import type { SwarmVisual } from "./SwarmVisual";

const FISH_ROTATIONAL_SPEED = {
  min: 0.008,
  max: 0.062
};

const FISH_SPEED = {
  min: 0.8,
  max: 2.6
};

const FISH = {
  LENGTH: 32,
  ANGLE: Geometry.degToRad(60),
  HEAD_SIZE: 12,
  FIN_POSITION: 16,
  FIN_WIDTH: 10,
  FIN_LENGTH: 8,
}

const FISH_COLORS = [
  '#f14d10',
  '#d62309',
  '#c7e3ff',
  '#f49d09',
  '#5c4073',
  '#e3495e',
  '#adbccf',
  '#00012e',
  '#df2205',
  '#9f1a0b',
  '#dd2c11'
]

function getFishDrawingInstructions(position: Point, rotation: number, color: IColor): DrawingInstructions {
  return {
    position,
    layers: [
      {
        id: 'fish-fins',
        strokes: [
          [
            'ellipse',
            Math.sin(rotation) * FISH.FIN_POSITION,
            Math.cos(rotation) * FISH.FIN_POSITION,
            FISH.FIN_WIDTH,
            FISH.FIN_LENGTH,
            -rotation,
            Math.PI,
            0,
            false
          ]
        ],
        fillStyle: Color.toString(Color.getDarkerColor(color, 28))
      },
      {
        id: 'fish-half-1',
        strokes: [
          ['moveTo', 0, 0],
          [
            'quadraticCurveTo',
            Math.sin(rotation - FISH.ANGLE) * FISH.HEAD_SIZE,
            Math.cos(rotation - FISH.ANGLE) * FISH.HEAD_SIZE,
            Math.sin(rotation) * FISH.LENGTH,
            Math.cos(rotation) * FISH.LENGTH,
          ],
        ],
        fillStyle: Color.toString(color)
      },
      {
        id: 'fish-half-2',
        strokes: [
          ['moveTo', 0, 0],
          [
            'quadraticCurveTo',
            Math.sin(rotation + FISH.ANGLE) * FISH.HEAD_SIZE,
            Math.cos(rotation + FISH.ANGLE) * FISH.HEAD_SIZE,
            Math.sin(rotation) * FISH.LENGTH,
            Math.cos(rotation) * FISH.LENGTH,
          ],
        ],
        fillStyle: Color.toString(color)
      }
    ]
  }
}


class Fish extends Member {
  draw() {
    Canvas.draw(
      this.visual.getContext(),
      // getArrowDrawingInstructions(this.position, this.rotation, this.getColor())
      getFishDrawingInstructions(this.position, this.rotation, this.color)
    );
  }
}

export function makeFish(visual: SwarmVisual): Fish {
  const properties = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    color: Color.hexToColor(Random.arrayItem(FISH_COLORS)!)!,
    rotationalSpeed: Random.prop(FISH_ROTATIONAL_SPEED),
    speed: Random.prop(FISH_SPEED),
    length: FISH.LENGTH
  };
  return new Fish(visual, properties);
}