import type { IColor, Point } from '$lib/util';

type MoveToStroke = ['moveTo', number, number];
type LineToStroke = ['lineTo', number, number];
type RectStroke = ['rect', number, number, number, number];
type QuadraticCurveToStroke = ['quadraticCurveTo', number, number, number, number];
type ArcStroke = ['arc', number, number, number, number, number, boolean];
type EllipseStroke = ['ellipse', number, number, number, number, number, number, number, boolean];

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
