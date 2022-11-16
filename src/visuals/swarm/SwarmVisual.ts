import { Canvas } from '$lib/canvas';
import { Random, type Point } from '$lib/util';
import { Visual } from '$lib/visual';
import { Member } from './Member';

export class SwarmVisual extends Visual {
	members: Member[];

	constructor(context: CanvasRenderingContext2D) {
		super(context);

		this.members = [];
	}

	setup() {
		for (let i = 0; i < 200; ++i) {
			this.members.push(new Member(this));
		}
		this.members.forEach((m) => m.selectNewToPoint());
	}

	drawFrame() {
		this.drawBackground();
		this.members.forEach((m) => {
			m.move();
			m.draw();
		});
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

	getMembers() {
		return this.members;
	}

	getRandomMember(): Member | undefined {
		return Random.arrayItem(this.members);
	}

	getRandomInboundsPoint(): Point {
		return {
			x: Random.number(this.W / 6, (5 * this.W) / 6),
			y: Random.number(this.H / 6, (5 * this.H) / 6)
		};
	}
}
