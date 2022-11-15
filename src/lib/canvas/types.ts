import type { IColor, Point } from "$lib/util";

type MoveToStroke = ['moveTo', number, number,];
type LineToStroke = ['lineTo', number, number];
type RectStroke = ['rect', number, number, number, number];
type QuadraticCurveToStroke = ['quadraticCurveTo', number, number, number, number];
type ArcStroke = ['arc', number, number, number, number, number, boolean];
type EllipseStroke = ['ellipse', number, number, number, number, number, number, number, boolean];

export type StrokeInstruction = MoveToStroke
  | LineToStroke
  | RectStroke
  | QuadraticCurveToStroke
  | ArcStroke
  | EllipseStroke;

export type GradientInstructions = {
  size: [number, number, number, number];
  colorStops: [number, IColor | string][];
}

type FillStyle = string | CanvasGradient;

export type LayerInstruction = {
  id: string;
  strokes: StrokeInstruction[];
  fillStyle?: FillStyle;
  strokeStyle?: string;
  lineWidth?: number;
}

export type DrawingInstructions = {
  center?: Point;
  layers: LayerInstruction[];
}

export type ShapeModifiers = {
  id: string;
  fillStyle?: FillStyle;
}

export type DrawingModifiers = {
  center?: Point;
  shapeModifiers?: ShapeModifiers[];
}
