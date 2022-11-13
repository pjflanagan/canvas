import type { DrawingInstructions, InstructionModifiers, Point, Shape, ShapeModifiers, Step } from './types'

function drawStep(ctx: CanvasRenderingContext2D, step: Step, center: Point): void {
  const [x, y] = center;
  const [moveType] = step;
  ctx.beginPath();
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
    case 'ellipse':
      ctx.ellipse(x + step[1], y + step[2], step[3], step[4], step[5], step[6], step[7], step[8]);
      break;
    default:
      throw `Unrecognized moveType [${moveType}] in step`;
  }
}

function drawShape(ctx: CanvasRenderingContext2D, shape: Shape, center: Point, modifiers?: ShapeModifiers): void {
  try {
    shape.steps.forEach(s => drawStep(ctx, s, center));
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

export function draw(ctx: CanvasRenderingContext2D, instructions: DrawingInstructions, modifiers?: InstructionModifiers): void {
  const workingCenter = modifiers?.center || instructions.center;
  instructions.shapes.forEach(s => {
    const shapeModifiers = modifiers?.shapeModifiers?.find(m => m.id === s.id);
    drawShape(ctx, s, workingCenter, shapeModifiers);
  });
}
