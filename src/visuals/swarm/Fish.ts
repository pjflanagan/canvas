import { Canvas, type DrawingInstructions } from '$lib/canvas';
import { Color, Geometry, Random, type IColor, type Point } from '$lib/util';
import { Member } from './Member';
import type { SwarmVisual } from './SwarmVisual';

const FISH_ROTATIONAL_SPEED = {
	min: 0.042,
	max: 0.062
};

const FISH_SPEED = {
	min: 3.4,
	max: 4.6
};

const FISH = {
	LENGTH: 32,
	HEAD_ANGLE: Geometry.degToRad(60), // this is the head bulge angle
	HEAD_SIZE: 12,
	FIN_POSITION: 16,
	FIN_WIDTH: 10, // TODO: variable
	FIN_LENGTH: 8,
	TAIL_START: 28, // TODO: variable
	TAIL_ANGLE: Geometry.degToRad(14),
	TAIL_LENGTH: 10
};

const FISH_COLORS = [
	'#f14d10',
	'#d62309',
	'#c7e3ff',
	'#f49d09',
	'#5c4073',
	'#e3495e',
	'#adbccf',
	'#00012e',
	'#df2205',
	'#9f1a0b',
	'#dd2c11'
];

function getFishDrawingInstructions(
	position: Point,
	rotation: number,
	color: IColor
): DrawingInstructions {
	const darkerColorString = Color.toString(Color.getDarkerColor(color, 28));
	const colorString = Color.toString(color);
	const sinRotation = Math.sin(rotation);
	const cosRotation = Math.cos(rotation);
	return {
		position,
		layers: [
			{
				id: 'fish-fins',
				strokes: [
					[
						'ellipse',
						sinRotation * FISH.FIN_POSITION,
						cosRotation * FISH.FIN_POSITION,
						FISH.FIN_WIDTH,
						FISH.FIN_LENGTH,
						-rotation,
						Math.PI,
						0,
						false
					]
				],
				fillStyle: darkerColorString
			},
			{
				id: 'tail',
				strokes: [
					['moveTo', sinRotation * FISH.TAIL_START, cosRotation * FISH.TAIL_START],
					[
						'lineTo',
						sinRotation * FISH.TAIL_START + Math.sin(rotation - FISH.TAIL_ANGLE) * FISH.TAIL_LENGTH, // TODO: move rotation to draw, draw this without math in Math.sin()
						cosRotation * FISH.TAIL_START + Math.cos(rotation - FISH.TAIL_ANGLE) * FISH.TAIL_LENGTH
					],
					[
						'lineTo',
						sinRotation * FISH.TAIL_START + Math.sin(rotation + FISH.TAIL_ANGLE) * FISH.TAIL_LENGTH,
						cosRotation * FISH.TAIL_START + Math.cos(rotation + FISH.TAIL_ANGLE) * FISH.TAIL_LENGTH
					]
				],
				fillStyle: darkerColorString
			},
			{
				id: 'fish-half-1',
				strokes: [
					['moveTo', 0, 0],
					[
						'quadraticCurveTo',
						Math.sin(rotation - FISH.HEAD_ANGLE) * FISH.HEAD_SIZE,
						Math.cos(rotation - FISH.HEAD_ANGLE) * FISH.HEAD_SIZE,
						sinRotation * FISH.LENGTH,
						cosRotation * FISH.LENGTH
					]
				],
				fillStyle: colorString
			},
			{
				id: 'fish-half-2',
				strokes: [
					['moveTo', 0, 0],
					[
						'quadraticCurveTo',
						Math.sin(rotation + FISH.HEAD_ANGLE) * FISH.HEAD_SIZE,
						Math.cos(rotation + FISH.HEAD_ANGLE) * FISH.HEAD_SIZE,
						sinRotation * FISH.LENGTH,
						cosRotation * FISH.LENGTH
					]
				],
				fillStyle: colorString
			}
		]
	};
}

class Fish extends Member {
	draw() {
		Canvas.draw(
			this.visual.getContext(),
			getFishDrawingInstructions(this.position, this.rotation, this.color)
		);
	}
}

export function makeFish(visual: SwarmVisual): Fish {
	const properties = {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		color: Color.hexToColor(Random.arrayItem(FISH_COLORS)!)!,
		rotationalSpeed: Random.propFloat(FISH_ROTATIONAL_SPEED),
		speed: Random.propFloat(FISH_SPEED),
		length: FISH.LENGTH
	};
	return new Fish(visual, properties);
}
