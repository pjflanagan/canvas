import type { Position, ShapeProps, Coordinates, Edge } from '../types';
import type { Grid } from '../Grid';
import type { CenterPoint, VertexPoint } from '../Point';
import { distance as getDistance } from '$lib/util';

export interface IShape<T> {
  getCenter(): CenterPoint<T>;
  getCenterPosition(): Position;
  getVertices(): VertexPoint<T>[];
  areAllPointsOnGrid(): boolean;
  areSomePointsOnGrid(): boolean;
  setValue(value: T): void;
  hasValue(): boolean;
  getValue(): T;
  // Shape extension
  getNeighbors(): IShape<T>[];
  getEdgeNeighbors(): IShape<T>[];
  getPointNeighbors(): IShape<T>[];
}

export class Shape<T> implements IShape<T> {
  protected grid: Grid<T>;
  protected props: ShapeProps;
  protected vertices: VertexPoint<T>[];
  protected center!: CenterPoint<T>;
  protected coordinates: Coordinates;

  constructor(grid: Grid<T>, coordinates: Coordinates, props: ShapeProps) {
    this.grid = grid;
    this.coordinates = coordinates;
    this.props = props;
    this.vertices = [];
  }

  protected makeVertex() {
    // this registers a vertex with the grid,
    // and pushes a vertex to the array
  }

  protected registerVertex(position: Position): VertexPoint<T> {
    return this.grid.registerVertex(this, position);
  }

  // Points

  getCenter(): CenterPoint<T> {
    return this.center;
  }

  getCenterPosition(): Position {
    return this.center.getPosition();
  }

  getVertices(): VertexPoint<T>[] {
    return this.vertices;
  }

  areAllPointsOnGrid(): boolean {
    return this.vertices.every((v) => this.grid.isPointWithinBounds(v));
  }

  areSomePointsOnGrid(): boolean {
    return this.vertices.some((v) => this.grid.isPointWithinBounds(v));
  }

  getVertex(index: number): VertexPoint<T> {
    return this.vertices[index % this.vertices.length];
  }

  getPointsNearPosition(position: Position): VertexPoint<T>[] {
    let points: VertexPoint<T>[] = [];

    let minDistance = getDistance(position, this.vertices[0].getPosition());
    this.vertices.forEach((v) => {
      const distance = getDistance(position, v.getPosition());
      if (minDistance > distance) {
        points = [];
        minDistance = distance;
      }
      if (distance === minDistance) {
        points.push(v);
      }
    });

    return points;
  }

  getPointsAwayFromPosition(position: Position): VertexPoint<T>[] {
    let points: VertexPoint<T>[] = [];

    let maxDistance = getDistance(position, this.vertices[0].getPosition());
    this.vertices.forEach((v) => {
      const distance = getDistance(position, v.getPosition());
      if (maxDistance < distance) {
        points = [];
        maxDistance = distance;
      }
      if (distance === maxDistance) {
        points.push(v);
      }
    });

    return points;
  }

  // Edges

  getEdges(): Edge<T>[] {
    const edges: Edge<T>[] = [];

    for (let i = 0; i < this.vertices.length; ++i) {
      edges.push([this.getVertex(i), this.getVertex(i + 1)]);
    }

    return edges;
  }

  // Value, stored in the center point

  setValue(value: T): void {
    this.center.setValue(value);
  }

  hasValue(): boolean {
    return this.center.hasValue();
  }

  getValue(): T {
    return this.center.getValue();
  }

  // Child Methods

  getNeighborThroughDelta(deltaCoordinates: Coordinates) {
    return this.grid.getShapeAt({
      row: this.coordinates.row + deltaCoordinates.row,
      col: this.coordinates.col + deltaCoordinates.col,
    });
  }

  getNeighborByAngle(angle: number) {
    const neighbors = this.getNeighbors();
    // search all the neighbors for the one whose center is
    // closest to the angle provided
    throw 'Method not implemented yet';
  }

  getNeighbors(): IShape<T>[] {
    throw 'getNeighbors needs to be implemented by child of Shape.';
  }
  getEdgeNeighbors(): IShape<T>[] {
    throw 'getEdgeNeighbors needs to be implemented by child of Shape.';
  }
  getPointNeighbors(): IShape<T>[] {
    throw 'getPointNeighbors needs to be implemented by child of Shape.';
  }
}
