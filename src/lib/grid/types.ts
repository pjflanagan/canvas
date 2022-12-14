import type { Point } from '$lib/util';
import type { VertexPoint } from './Point';

// Grid

export type GridProps = ShapeProps & {
  width: number;
  height: number;
  // negativeOffset: Position;
  // maxRow
  // maxHeight
};

// Shape

export type Coordinates = {
  row: number;
  col: number;
};

export enum ShapeType {
  ROW_TRIANGLE,
  COLUMN_TRIANGLE,
  SQUARE,
  DIAMOND,
  FLAT_HEXAGON,
  POINTY_HEXAGON,
}

export type ShapeProps = {
  type: ShapeType;
  size: number;
};

// Point

export enum PointType {
  CENTER,
  VERTEX,
}

export type Position = Point;

export type PointProps = {
  position: Position;
  type: PointType;
};

export type Edge<T> = [VertexPoint<T>, VertexPoint<T>];
