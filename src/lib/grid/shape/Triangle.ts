import { ShapeType } from '../types';
import type { Coordinates } from '../types';
import type { Grid } from '../Grid';
import { Shape } from './Shape';
import type { IShape } from './Shape';

export class RowTriangle<T> extends Shape<T> implements IShape<T> {
  constructor(grid: Grid<T>, coordinates: Coordinates, size: number) {
    super(grid, coordinates, {
      type: ShapeType.ROW_TRIANGLE,
      size,
    });
    this.initPoints();
  }

  initPoints() {
    throw new Error('Method not implemented.');
  }

  getEdgeNeighbors(): IShape<T>[] {
    throw new Error('Method not implemented.');
  }
  getPointNeighbors(): IShape<T>[] {
    throw new Error('Method not implemented.');
  }

  getNeighbors(): IShape<T>[] {
    throw new Error('Method not implemented.');
  }
}

export class ColumnTriangle<T> extends Shape<T> implements IShape<T> {
  constructor(grid: Grid<T>, coordinates: Coordinates, size: number) {
    super(grid, coordinates, {
      type: ShapeType.COLUMN_TRIANGLE,
      size,
    });
    this.initPoints();
  }

  initPoints() {
    throw new Error('Method not implemented.');
  }

  getEdgeNeighbors(): IShape<T>[] {
    throw new Error('Method not implemented.');
  }
  getPointNeighbors(): IShape<T>[] {
    throw new Error('Method not implemented.');
  }

  getNeighbors(): IShape<T>[] {
    throw new Error('Method not implemented.');
  }
}
