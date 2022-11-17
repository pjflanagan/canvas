import { Canvas } from '$lib/canvas';
import { Random, type Point } from '$lib/util';
import { Visual } from '$lib/visual';
import { makeFish } from './Fish';
import type { Member } from './Member';

const SWARM = {
	MEMBER_COUNT: 280,
}

export class SwarmVisual extends Visual {
	members: Member[];

	constructor(context: CanvasRenderingContext2D) {
		super(context);

		this.members = [];
	}

	setup() {
		for (let i = 0; i < SWARM.MEMBER_COUNT; ++i) {
			this.members.push(makeFish(this));
		}
		this.members.forEach((m) => m.selectNewToPoint());
	}

	drawFrame() {
		this.drawBackground();
		this.members.forEach((m, i) => {
			m.move();
			m.draw();
			if (i % 14 === 0) {
				this.drawLayer();
			}
		});
	}

	drawLayer() {
		Canvas.draw(this.ctx, {
			layers: [
				{
					id: 'background',
					strokes: [['rect', 0, 0, this.W, this.H]],
					fillStyle: '#51a6d618'
				}
			]
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

	getRandomOnScreenPoint(): Point {
		return {
			x: Random.number(0, this.W),
			y: Random.number(0, this.H),
		}
	}

	getRandomInboundsPoint(): Point {
		return {
			x: Random.number(this.W / 6, (5 * this.W) / 6),
			y: Random.number(this.H / 6, (5 * this.H) / 6)
		};
	}
}
