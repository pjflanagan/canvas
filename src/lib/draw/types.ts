
export type Point = [number, number];

type MoveToStep = ['moveTo', number, number];
type LineToStep = ['lineTo', number, number];
type QuadraticCurveToStep = ['quadraticCurveTo', number, number, number, number];
type ArcStep = ['arc', number, number, number, number, number, boolean];
type EllipseStep = ['ellipse', number, number, number, number, number, number, number, boolean];

export type Step = MoveToStep | LineToStep | QuadraticCurveToStep | ArcStep | EllipseStep;

export type Shape = {
  id: string;
  steps: Step[];
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
}

export type DrawingInstructions = {
  center: Point;
  shapes: Shape[];
}

export type ShapeModifiers = {
  id: string;
  fillStyle?: string;
}

export type InstructionModifiers = {
  center?: Point;
  shapeModifiers?: ShapeModifiers[];
}
