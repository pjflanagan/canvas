import { Canvas } from "$lib/canvas";
import { Random, type Point } from "$lib/util";
import type { FireflyVisual } from "./FireflyVisual";

class Branch {
  visual: FireflyVisual;
  branchOrder: number;
  pos: Point;
  angle: number;
  length: number;

  branches: Branch[];

  constructor(visual: FireflyVisual, branchOrder: number, position: Point, angle: number, length: number) {
    this.visual = visual;
    this.branchOrder = branchOrder;
    this.pos = position;
    this.angle = angle;
    this.length = length;

    this.branches = [];
    if (branchOrder > 0) {
      // make the branches along the length of this branch
      const branchCount = Random.number(6, 9);
      for (let i = 0; i < branchCount; ++i) {
        const nextBranchDistanceUpBranch = Random.float(0.6, 1) * this.length;
        this.branches.push(new Branch(
          this.visual,
          this.branchOrder - 1,
          // random position along the branch at least 60% of the way up
          {
            x: this.pos.x - nextBranchDistanceUpBranch * Math.sin(this.angle),
            y: this.pos.y - nextBranchDistanceUpBranch * Math.cos(this.angle)
          },
          // random angle in addition to this angle
          this.angle + Random.float(-1, 1),
          // random length
          Random.float(68 * this.branchOrder, 86 * this.branchOrder)
        ))
      }
    }
  }

  draw() {
    this.drawBranch();
    this.branches.forEach(b => b.draw());
  }

  drawBranch() {
    Canvas.draw(this.visual.getContext(),
      {
        layers: [
          {
            id: 'branch',
            strokes: [
              ['moveTo', this.pos.x, this.pos.y],
              [
                'lineTo',
                this.pos.x - Math.sin(this.angle) * this.length,
                this.pos.y - Math.cos(this.angle) * this.length
              ]
            ],
            strokeStyle: '#000a',
            lineWidth: this.branchOrder * this.branchOrder * 5,
          },
        ]
      })
  }

  move() {
    return;
  }
}

// A tree is a branch with a base at the bottom
export class Tree extends Branch {
  constructor(visual: FireflyVisual) {
    const { W, H } = visual.getSize();
    super(
      visual,
      3,
      {
        x: Random.float(0, W),
        y: H
      },
      Random.float(-0.05, 0.05),
      Random.number(H / 3, 2 * H / 3)
    );
  }
}
