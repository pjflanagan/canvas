import { Random } from '$lib/util';
import { Visual } from '$lib/visual';
import { Planet } from './Planet';

const WORLD = {
	PLANETS: { min: 2, max: 5 },
	SPEED: { min: 1, max: 10 }
};

export enum LineMode {
	TICKS,
	ON,
	OFF
}

enum Mode {
	PLANET = 'PLANET',
	ATOM = 'ATOM',
	LINES = 'LINES',
	TOROID = 'TOROID',
	TRIANGLE = 'TRIANGLE'
}

const MODE_LIST = [
	Mode.PLANET,
	Mode.ATOM,
	Mode.LINES, // BROKEN
	Mode.TOROID, // BROKEN
	Mode.TRIANGLE
];

type ModeProperties = {
	FADE: string;
	PLANETS: boolean;
	ORBITS: boolean;
	MIDPOINTS: boolean;
	LINES: LineMode;
	SECONDARY: LineMode;
	TRIANGLE: boolean;
};

const MODE_PROPERTY_MAP: { [key in Mode]: ModeProperties } = {
	PLANET: {
		FADE: '88',
		PLANETS: true,
		ORBITS: true,
		MIDPOINTS: true,
		LINES: LineMode.ON,
		SECONDARY: LineMode.OFF,
		TRIANGLE: false
	},
	ATOM: {
		FADE: '10',
		PLANETS: false,
		ORBITS: false,
		MIDPOINTS: true,
		LINES: LineMode.OFF,
		SECONDARY: LineMode.OFF,
		TRIANGLE: false
	},
	LINES: {
		FADE: '01',
		PLANETS: false,
		ORBITS: false,
		MIDPOINTS: false,
		LINES: LineMode.TICKS,
		SECONDARY: LineMode.OFF,
		TRIANGLE: false
	},
	TOROID: {
		FADE: '01',
		PLANETS: false,
		ORBITS: false,
		MIDPOINTS: false,
		LINES: LineMode.OFF,
		SECONDARY: LineMode.TICKS,
		TRIANGLE: false
	},
	TRIANGLE: {
		FADE: '88',
		PLANETS: false,
		ORBITS: false,
		MIDPOINTS: false,
		LINES: LineMode.OFF,
		SECONDARY: LineMode.OFF,
		TRIANGLE: true
	}
};

function getRandomMode(): Mode {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return Random.arrayItem(MODE_LIST)!;
}

export function getModeProperties(mode: Mode): ModeProperties {
	return MODE_PROPERTY_MAP[mode];
}

export class OrbitsVisual extends Visual {
	static visualName = 'Orbit';
  static visualLink = 'orbits';
	planets: Planet[];
	mode: Mode;
	speed: number;
	planetTracker: number;

	constructor(ctx: CanvasRenderingContext2D) {
		super(ctx);

		this.mode = getRandomMode();
		this.planets = [];
		this.speed = 1;
		this.planetTracker = 0;
		this.setup();
		this.drawBackground();

		this.animate = this.animate.bind(this);
		this.start();
	}

	setup() {
		let planetCount = Random.propFloat(WORLD.PLANETS);
		const modeProperties = getModeProperties(this.mode);
		if (modeProperties.SECONDARY !== LineMode.OFF || modeProperties.TRIANGLE) planetCount += 1;
		for (let i = 0; i < planetCount; ++i) {
			this.addPlanet();
		}
		this.clearCanvas();
	}

	drawFrame() {
		const modeProperties = getModeProperties(this.mode);
		this.drawBackground();
		this.planets.forEach((planet) => {
			planet.move();
			planet.draw();
		});
		this.planets.forEach((planet1) => {
			this.planets.forEach((planet2) => {
				if (planet1.id < planet2.id) {
					// less than to only draw lines once
					planet1.drawLine(planet2);

					if (modeProperties.SECONDARY !== LineMode.OFF || modeProperties.TRIANGLE) {
						this.planets.forEach((planet3) => {
							if (modeProperties.SECONDARY !== LineMode.OFF && planet2.id < planet3.id) {
								planet1.drawSecondLine(planet2, planet3);
							}
							if (
								modeProperties.TRIANGLE &&
								(planet3.id !== planet1.id || planet3.id !== planet2.id)
							) {
								planet1.drawTriangle(planet2, planet3);
							}
						});
					}
				}
			});
		});
	}

	// helpers

	setRandomMode() {
		this.mode = getRandomMode();
	}

	setMode(newMode: Mode) {
		this.mode = newMode;
	}

	changeSpeed(speed: number) {
		if (
			(this.speed === WORLD.SPEED.max && speed === 1) ||
			(this.speed === WORLD.SPEED.min && speed === -1)
		)
			return;
		this.speed += speed;
	}

	addPlanet() {
		if (this.planets.length === WORLD.PLANETS.max) {
			return;
		}
		this.planetTracker += 1;
		this.planets.push(new Planet(this, this.planetTracker));
	}

	clearCanvas() {
		this.ctx.beginPath();
		this.ctx.rect(0, 0, this.W, this.H);
		this.ctx.fillStyle = '#1c1c1c';
		this.ctx.fill();
	}

	drawBackground() {
		const modeProperties = getModeProperties(this.mode);
		this.ctx.beginPath();
		this.ctx.rect(0, 0, this.W, this.H);
		this.ctx.fillStyle = '#1c1c1c' + modeProperties.FADE;
		this.ctx.fill();
	}

	random() {
		this.stop();
		this.clearCanvas();
		this.planets = [];
		this.setup();
		this.start();
	}
}
