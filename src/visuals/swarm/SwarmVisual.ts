import { Canvas } from '$lib/canvas';
import { Random, type Point } from '$lib/util';
import { Visual } from '$lib/visual';
import { makeFish } from './Fish';
import type { Member } from './Member';

const SWARM = {
	MEMBER_COUNT: 180
};
export class SwarmVisual extends Visual {
	static visualName = 'Koy Pond';
	layers: (Member | boolean)[]; // TODO: a layer should also be Water
	members: Member[];
	// waterColors: IColor[];

	constructor(context: CanvasRenderingContext2D) {
		super(context);

		this.layers = [];
		this.members = [];
		// this.waterColors = Color.makeSpectrum(
		// 	Color.hexToColor('#1c4da3')!,
		// 	Color.hexToColor('#51a6d6')!,
		// 	SWARM.MEMBER_COUNT / 14
		// );
	}

	setup() {
		for (let i = 0; i < SWARM.MEMBER_COUNT; ++i) {
			const member = makeFish(this);
			this.members.push(member);
			this.layers.push(member);
			if (i % 14 === 0) {
				this.layers.push(true);
			}
		}
		this.members.forEach((m) => {
			m.selectNewToPoint();
		});
	}

	drawFrame() {
		this.drawBackground();
		this.layers.forEach((l) => {
			if (typeof l === 'boolean') {
				this.drawLayer();
			} else {
				l.move();
				l.draw();
			}
		});
	}

	drawLayer() {
		const grd = this.ctx.createRadialGradient(this.W / 2, this.H / 2, 0, this.W / 2, this.H / 2, this.diagonalLength / 2);
		grd.addColorStop(0, '#51a6d618');
		grd.addColorStop(1, '#1c4da326');
		Canvas.draw(this.ctx, {
			layers: [
				{
					id: 'background',
					strokes: [['rect', 0, 0, this.W, this.H]],
					fillStyle: grd,
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
					fillStyle: '#1c4da3'
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
			y: Random.number(0, this.H)
		};
	}

	getRandomInboundsPoint(): Point {
		return {
			x: Random.number(this.W / 6, (5 * this.W) / 6),
			y: Random.number(this.H / 6, (5 * this.H) / 6)
		};
	}
}
