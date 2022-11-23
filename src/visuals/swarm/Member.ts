import { Geometry, Motion, Random, type Point } from '$lib/util';
import type Color from 'color';
import type { SwarmVisual } from './SwarmVisual';

export type MemberProperties = {
  rotationalSpeed: number;
  speed: number;
  color: Color;
  length: number;
};

export enum MovementType {
  TO,
  FOLLOWING,
  MOUSE_FLEE,
  MOUSE_TO,
}

function getRandomMovementType(): MovementType {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return Random.arrayItemWeighted(
    [MovementType.TO, MovementType.FOLLOWING, MovementType.MOUSE_TO],
    [4, 7, 2],
  )!;
}
export class Member {
  visual: SwarmVisual;
  movement: {
    movementType: MovementType;
    to: Point;
    following: Member;
  };
  position: Point;
  rotation: number;
  color: Color;
  rotationalSpeed: number;
  speed: number;
  length: number;

  constructor(visual: SwarmVisual, properties: MemberProperties) {
    this.visual = visual;

    this.color = properties.color;
    this.rotationalSpeed = properties.rotationalSpeed;
    this.speed = properties.speed;
    this.length = properties.length;

    this.movement = {
      movementType: MovementType.TO,
      to: this.visual.getRandomOnScreenPoint(),
      following: this, // placeholder
    };
    this.position = this.visual.getRandomOnScreenPoint();
    this.rotation = Random.float(-Math.PI, Math.PI);
  }

  getToPoint(): Point {
    switch (this.movement.movementType) {
      case MovementType.MOUSE_TO:
        return this.visual.getUserPosition().mousePos;
      case MovementType.FOLLOWING:
        return this.movement.following.getTailPoint();
      case MovementType.MOUSE_FLEE:
      case MovementType.TO:
      default:
        return this.movement.to;
    }
  }

  shouldSelectNewToPoint() {
    const toPoint = this.getToPoint();
    return (
      Motion.hasReachedPoint(this.position, toPoint, 30) ||
      this.isOutOfBounds() ||
      Random.odds(0.001)
    );
  }

  selectNewToPoint() {
    this.movement = {
      movementType: getRandomMovementType(),
      to: this.visual.getRandomOnScreenPoint(),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      following: this.visual.getRandomMember()!,
    };
  }

  shouldFleeMouse() {
    return (
      this.movement.movementType !== MovementType.MOUSE_FLEE &&
      Motion.hasReachedPoint(this.position, this.visual.getUserPosition().mousePos, 56)
    );
  }

  selectPointAwayFromMouse() {
    this.movement.movementType = MovementType.MOUSE_FLEE;
    this.movement.to = Motion.getPointInDirection(this.position, this.rotation + Math.PI, 100);
  }

  move() {
    if (this.shouldSelectNewToPoint()) {
      this.selectNewToPoint();
    } // else if (this.shouldFleeMouse()) {
    //   this.selectPointAwayFromMouse();
    // }
    const toPoint = this.getToPoint();
    const angleTo = Geometry.getAngleTo(this.position, toPoint);
    this.rotation = Motion.rotateTowardsAngleAtSpeed(this.rotation, angleTo, this.rotationalSpeed);
    this.position = Motion.moveInDirectionOfAngle(this.position, this.rotation, this.speed);
  }

  draw() {
    throw 'Child should implement this function';
  }

  getTailPoint(): Point {
    const { x, y } = this.position;
    return {
      x: x + Math.sin(this.rotation) * this.length,
      y: y + Math.cos(this.rotation) * this.length,
    };
  }

  isOutOfBounds(): boolean {
    const { W, H } = this.visual.getSize();
    return Motion.isOutOfBounds(this.position, { x: W, y: H });
  }
}
