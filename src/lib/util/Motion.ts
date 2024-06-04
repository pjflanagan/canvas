import { type Point, Geometry, ZERO_POINT } from './Geometry';

export class Motion {

  static isClose(source: number, target: number, threshold: number) {
    return Math.abs(source - target) < threshold;
  }

  static hasReachedPoint(sourcePoint: Point, targetPoint: Point, threshold: number): boolean {
    return Geometry.distance(sourcePoint, targetPoint) < threshold;
  }

  static isInBounds(pos: Point, upperBounds: Point, lowerBounds: Point = ZERO_POINT): boolean {
    return (
      pos.x > lowerBounds.x &&
      pos.x < upperBounds.x &&
      pos.y > lowerBounds.y &&
      pos.y < upperBounds.y
    );
  }

  static isOutOfBounds(pos: Point, upperBounds: Point, lowerBounds: Point = ZERO_POINT): boolean {
    return !Motion.isInBounds(pos, upperBounds, lowerBounds);
  }

  static getPointInDirection(cur: Point, angle: number, radius: number): Point {
    return {
      x: cur.x + Math.cos(angle) * radius,
      y: cur.y + Math.sin(angle) * radius,
    };
  }

  // returns a new position in the direction of a point
  // if the point is closer than the speed, it returns the original point
  static moveTowardsPoint(cur: Point, to: Point, speed: number): Point {
    if (Motion.hasReachedPoint(cur, to, speed)) {
      return cur;
    }
    const angle = Math.atan2(to.y - cur.y, to.x - cur.x);
    return Motion.moveAtAngle(cur, angle, speed);
  }

  // returns a new position in the direction of an angle
  static moveAtAngle(pos: Point, angle: number, speed: number): Point {
    return {
      x: pos.x + Math.cos(angle) * speed,
      y: pos.y + Math.sin(angle) * speed,
    };
  }

  // returns a new position in the direction of an angle
  static moveInDirectionOfAngle(pos: Point, angle: number, speed: number): Point {
    return {
      x: pos.x + Math.sin(angle) * -speed,
      y: pos.y + Math.cos(angle) * -speed,
    };
  }

  // returns the new angle source should be rotated at
  // if the delta is less than the rotation speed, it does not change the angle
  static rotateTowardsAngleAtSpeed(
    sourceAngle: number,
    targetAngle: number,
    rotationSpeed: number,
  ): number {
    const deltaAngle = Geometry.getDeltaAngle(sourceAngle, targetAngle);
    if (Math.abs(deltaAngle) < Math.abs(rotationSpeed)) {
      return sourceAngle;
    }
    return sourceAngle - Math.sign(deltaAngle) * rotationSpeed;
  }
}
