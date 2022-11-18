import { Color, Random } from '$lib/util';
import { Body } from './Body';
import { SHIP } from './Ship';
// import type { SpaceVisual } from "./SpaceVisual";

const MOON = {
	RADIUS: { min: 0.02, max: 0.06 },
	COLORS: 3,
	OFFSET: {
		SPEED: 0.1,
		MAX_RADIUS: 40
	},
	CENTER: {
		x: { min: -0.25, max: 1 },
		y: { min: 0.001, max: 0.999 }
	},
	SCROLL_SHIFT_RATE: 14
};

export class Moon extends Body {
	setup() {
		const { shorterSideLength, W, H } = this.visual.getSize();
		const color = Color.getRandomColor(0.9);
		const toColor = Color.getRandomColor(0.9);

		// unchanging props
		const radius = Random.propFloat(MOON.RADIUS, shorterSideLength);
		const minX = this.layer > 5 ? SHIP.CENTER.x * H + radius * 3 : MOON.CENTER.x.min * W;
		this.prop = {
			center: {
				x: Random.number(minX, W - radius * 2),
				y: Random.number(0, H)
			},
			radius,
			colorSpectrum: Color.makeSpectrum(color, toColor, MOON.COLORS),
			offsetRadiusMax: MOON.OFFSET.MAX_RADIUS,
			offsetSpeed: MOON.OFFSET.SPEED,
			scrollShiftRate: MOON.SCROLL_SHIFT_RATE
		};
		const randomStripeColor = Color.getRandomColor(0.7);
		Random.insert(this.prop.colorSpectrum, randomStripeColor);
		this.setupColors();
	}

	move() {
		const mouseShift = this.getMouseShiftedCenter();
		const scrollShift = this.getScrollShiftedCenter();
		this.moveBody({
			x: mouseShift.x + scrollShift.x,
			y: mouseShift.y + scrollShift.y
		});
		this.moveColors();
	}

	draw() {
		this.drawTrail();
		this.drawSpectrum();
	}
}
