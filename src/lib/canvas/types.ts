import type { IColor, Point } from '$lib/util';

type Coordinate = number;
type Radius = number;
type Angle = number;
type CounterClockwise = boolean;

type MoveToStroke = ['moveTo', Coordinate, Coordinate];
type LineToStroke = ['lineTo', Coordinate, Coordinate];
type RectStroke = ['rect', Coordinate, Coordinate, Coordinate, Coordinate];
type QuadraticCurveToStroke = ['quadraticCurveTo', Coordinate, Coordinate, Coordinate, Coordinate];
type ArcStroke = ['arc', Coordinate, Coordinate, Radius, Angle, Angle, CounterClockwise];
type EllipseStroke = [
  'ellipse',
  Coordinate,
  Coordinate,
  Radius,
  Radius,
  Angle,
  Angle,
  Angle,
  CounterClockwise,
];

export type StrokeInstruction =
  | MoveToStroke
  | LineToStroke
  | RectStroke
  | QuadraticCurveToStroke
  | ArcStroke
  | EllipseStroke;

export type GradientInstructions = {
  size: [number, number, number, number];
  colorStops: [number, IColor | string][];
};

type FillStyle = string | CanvasGradient;

type LayerProperties = {
  fillStyle?: FillStyle;
  strokeStyle?: string;
  lineWidth?: number;
  rotation?: number;
};

export type LayerInstruction = LayerProperties & {
  id: string;
  strokes: StrokeInstruction[];
};

type DrawingProperties = {
  position?: Point;
  rotation?: number;
};

export type DrawingInstructions = DrawingProperties & {
  layers: LayerInstruction[];
};

export type LayerModifiers = LayerProperties & {
  id: string;
};

export type DrawingModifiers = DrawingProperties & {
  layerModifiers?: LayerModifiers[];
};
