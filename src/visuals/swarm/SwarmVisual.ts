import { Canvas } from "$lib/canvas";
import { Visual } from "$lib/visual";
import { Member } from "./Member";

export class SwarmVisual extends Visual {
  members: Member[];

	constructor(context: CanvasRenderingContext2D) {
    super(context);

    this.members = [];
  }

  setup() {
    this.members.push(new Member(this));
  }

  drawFrame() {
    this.members.forEach(m => m.draw());
  }

	drawBackground() {
		Canvas.draw(this.ctx, {
			layers: [
				{
					id: 'background',
					strokes: [['rect', 0, 0, this.W, this.H]],
					fillStyle: '#51a6d6'
				}
			]
		});
	}
}
