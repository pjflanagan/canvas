
export type Point = {
  x: number;
  y: number;
}

export const distance = (a: Point, b: Point) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

type CircleIntersectionParams = {
  eRadx: number;
  eRady: number;
  cRad: number;
}

type CircleIntersectionPoint = Point & {
  phi: number;
  theta: number;
}

export const ellipseCircleIntersection = ({ eRadx, eRady, cRad }: CircleIntersectionParams) => {
  // https://www.analyzemath.com/EllipseProblems/ellipse_intersection.html
  const num = (eRadx * eRadx) - (cRad * cRad);
  const denom = ((eRadx * eRadx) / (eRady * eRady)) - 1;
  const y = Math.sqrt(num/denom);
  const x = Math.sqrt(cRad * cRad - y * y);
  const values: CircleIntersectionPoint[] = [
    { x, y, phi: Math.atan2(y , x), theta: -1 },
    { x: -x, y, phi: Math.atan2(y , -x), theta: -1 },
    { x, y: -y, phi: Math.atan2(-y , x), theta: -1 },
    { x: -x, y: -y, phi: Math.atan2(-y , -x), theta: -1 }
  ];
  // https://www.petercollingridge.co.uk/tutorials/computational-geometry/finding-angle-around-ellipse/
  values.forEach(v => {
    v.theta = Math.atan(eRadx/eRady * Math.tan(v.phi))
  });
  return values;
}

export class LinearFormula {
  m: number;
  b: number;

  constructor(min: Point, max: Point) {
    this.m = (max.y - min.y) / (max.x - min.x);
    this.b = min.y - (this.m * min.x);
  }

  calc(x: number) {
    return this.m * x + this.b;
  }
}

export class QuadraticFormula {
  vertex: Point;
  a: number;

  constructor(point: Point, vertex: Point) {
    this.vertex = vertex;
    this.a = point.y - vertex.y / Math.pow(point.x-vertex.x, 2)
  }

  calc(x: number) {
    const { a, vertex } = this;
    return a * Math.pow((x-vertex.x), 2) + vertex.y;
  }
}