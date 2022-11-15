import { Color, type Point } from '$lib/util';
import type { DrawingInstructions, DrawingModifiers, LayerInstruction, ShapeModifiers, StrokeInstruction, GradientInstructions } from './types'

function drawStroke(ctx: CanvasRenderingContext2D, step: StrokeInstruction, center?: Point): void {
  const {x, y} = center || {x: 0, y: 0};
  const [moveType] = step;
  switch(moveType) {
    case 'moveTo':
      ctx.moveTo(x + step[1], y + step[2]);
      break;
    case 'lineTo':
      ctx.lineTo(x + step[1], y + step[2]);
      break;
    case 'quadraticCurveTo':
      ctx.quadraticCurveTo(x + step[1], y + step[2], x + step[3], y + step[4]);
      break;
    case 'arc':
      ctx.arc(x + step[1], y + step[2], step[3], step[4], step[5], step[6]);
      break;
    case 'rect':
      ctx.rect(x + step[1], y + step[2], x + step[3], y + step[4]);
      break;
    case 'ellipse':
      ctx.ellipse(x + step[1], y + step[2], step[3], step[4], step[5], step[6], step[7], step[8]);
      break;
    default:
      throw `Unrecognized moveType [${moveType}] in step`;
  }
}

function drawLayer(ctx: CanvasRenderingContext2D, shape: LayerInstruction, center?: Point, modifiers?: ShapeModifiers): void {
  ctx.beginPath();
  try {
    shape.strokes.forEach(s => drawStroke(ctx, s, center));
  } catch (e) {
    throw `Error in shape [id: ${shape.id}]: ${e}`;
  }
  const fillStyle = modifiers?.fillStyle || shape.fillStyle
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (shape.lineWidth && shape.strokeStyle) {
    ctx.strokeStyle = shape.strokeStyle;
    ctx.lineWidth = shape.lineWidth;
    ctx.stroke();
  }
}

export class Canvas {

  // Draws a fix shape that can be moved (not rotated or resized)
  // If you want to draw something with some parts fixed and some parts variable, you will have to do so manually
  static draw(ctx: CanvasRenderingContext2D, instructions: DrawingInstructions, modifiers?: DrawingModifiers): void {
    const workingCenter = modifiers?.center || instructions.center;
    instructions.layers.forEach(s => {
      const shapeModifiers = modifiers?.shapeModifiers?.find(m => m.id === s.id);
      drawLayer(ctx, s, workingCenter, shapeModifiers);
    });
  }
  
  static createLinearGradient(ctx: CanvasRenderingContext2D, instructions: GradientInstructions): CanvasGradient {
    const { size, colorStops } = instructions;
    const grd = ctx.createLinearGradient(size[0], size[1], size[2], size[3]);
    colorStops.forEach(([percent, color]) => {
      grd.addColorStop(percent, typeof color === 'string' ? color : Color.toString(color));
    });
    return grd;
  }
}
