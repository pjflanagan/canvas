import { Canvas } from "$lib/canvas";
import type { Point } from "$lib/util";
import type { SwarmVisual } from "./SwarmVisual";

// TODO: these should either be birds, or fish
// I'm sure I could make a decent looking fish

const MEMBER = {
  LENGTH: 10,
	ANGLE: -.25,
}

export class Member {
  visual: SwarmVisual;
  movement: {
    movementType: 'to' | 'following';
    to?: Point;
    following?: Member;
  }
  position: Point;
  speed: number;
  angle: number;
  angularVelocity: number;

  constructor(visual: SwarmVisual) {
    this.visual = visual;
    this.movement = {
      movementType: 'to',
      to: { x: 0, y: 0},
    };
    this.position = { x: 0, y: 0};
    this.speed = 0;
    this.angle = 0;
    this.angularVelocity = .08;
  }

  draw() {
    Canvas.draw(
      this.visual.getContext(),
      {
        position: this.position,
        layers: [
          {
            id: 'bird-pointer',
            strokes: [
              ['moveTo', 0, 0],
              ['lineTo', Math.cos(this.angle - MEMBER.ANGLE) * MEMBER.LENGTH, Math.sin(this.angle - BIRD.ANGLE) * MEMBER.LENGTH],
              ['lineTo', Math.cos(this.angle + MEMBER.ANGLE) * MEMBER.LENGTH, Math.sin(this.angle + BIRD.ANGLE) * MEMBER.LENGTH],
            ],
            fillStyle: this.getColor(),
            // rotation: this.angle TODO: try this out
          }
        ]
      },
    );
    
    // const to = this.movement.to;
    // if (to) {
    //   this.ctx.beginPath();
    //   this.ctx.moveTo(x, y);
    //   this.ctx.lineTo(to.x, to.y);
    //   this.ctx.strokeStyle = this.getColor() + "4";
    //   this.ctx.stroke();
    // }
  }

  getTail(): Point {
    const { x, y } = this.position;
		return {
			x: x + Math.cos(this.angle) * MEMBER.LENGTH,
			y: y + Math.sin(this.angle) * MEMBER.LENGTH,
		}
	}

  getColor() {
		if (this.movement.movementType === 'following') {
			return '#00F';
		}
		return '#F00';
	}
}