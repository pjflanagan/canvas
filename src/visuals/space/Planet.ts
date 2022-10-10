import { Body } from "./Body";
import { ColorMixer, ellipseCircleIntersection, Random, type Color } from "$lib/util";
import type { Space } from "./Space";

const PLANET = {
  RADIUS: { min: 0.36, max: 0.42 }, // proportional to space 0.2, 0.3
  COLORS: 5,
  OFFSET: {
    SPEED: 0.1,
    MAX_RADIUS: 40,
  },
  SCROLL_SHIFT_RATE: 6,
  RING: {
    GAP: 30,
    COUNT: { min: 14, max: 24 },
    START_ANGLE: { min: Math.PI / 6, max: 5 * Math.PI / 6},
    RATE: Math.PI / 1000
  }
};

type Ring = {
  color: Color,
  offsetY: number,
  lineWidth: number
}

export class Planet extends Body {
  constructor(space: Space, layer: number, id: number) {
    super(space, layer, id);
    this.drawRing = this.drawRing.bind(this);
  }

  setup() {
    const color = ColorMixer.getRandomColor(0.9); // random color TODO: use a pallet
    const toColor = ColorMixer.getRandomColor(0.9);

    // unchanging props
    this.prop = {
      center: { x: this.visual.W / 2, y: this.visual.H / 2 }, // planet is in the center
      radius: Random.prop(PLANET.RADIUS, this.visual.H),
      colorSpectrum: ColorMixer.makeSpectrum(color, toColor, PLANET.COLORS),
      offsetRadiusMax: PLANET.OFFSET.MAX_RADIUS,
      offsetSpeed: PLANET.OFFSET.SPEED,
      scrollShiftRate: PLANET.SCROLL_SHIFT_RATE
    };
    Random.insert(this.prop.colorSpectrum, ColorMixer.getRandomColor());
    this.setupColors();
    this.setupRing();
  }

  setupRing() {
    this.prop.ringAngleCenter = Random.prop(PLANET.RING.START_ANGLE);
    this.prop.rings = [] as Ring[];
    const ringCount = Random.prop(PLANET.RING.COUNT);
    const color = ColorMixer.getRandomColor();
    const toColor = ColorMixer.getRandomColor();
    const ringSpectrum = ColorMixer.makeSpectrum(color, toColor, ringCount);
    const ringGap = Random.number(6,12);
    for(let i = 0; i < ringSpectrum.length; ++i){
      this.prop.rings.push({
        color: ringSpectrum[i],
        offsetY: i * ringGap + PLANET.RING.GAP,
        lineWidth: 1
      });
    }

    this.state.ringAngle = this.prop.ringAngleCenter;
    this.state.ringAngleInc = 0;
  }

  move() {
    const mouseShift = this.getMouseShiftedCenter();
    const scrollShift = this.getScrollShiftedCenter();
    this.moveBody({
      x: mouseShift.x + scrollShift.x,
      y: mouseShift.y + scrollShift.y,
    });
    this.moveColors();
    this.moveRing()
  }


  moveRing() {
    // wiggle the ring angle back and forth a little bit
    // set the ring angle based on the scroll and wiggling
    const { scrollPercent } = this.visual;
    const scrollOffsetAngle = - Math.PI / 6 * scrollPercent;
    this.state.ringAngleInc += PLANET.RING.RATE;
    const wiggleAngle = Math.sin(this.state.ringAngleInc) * 0.2
    this.state.ringAngle = wiggleAngle + scrollOffsetAngle + this.prop.ringAngleCenter;
  }

  draw() {
    this.drawTrail();
    this.drawSpectrum();
    this.drawRing();
  }

  drawRing() {
    const { scrollPercent } = this.visual;
    const { radius } = this.prop;
    const { x, y } = this.state.pos;
    const angle = this.state.ringAngle;

    // TODO: we also need to move the x,y radius to pass over the planet
    // if x is less than zero and then reset x to be abs(x) before we draw
    // to get it to flip to the other side we would draw intersection[2 and 3]?
    
    this.prop.rings.forEach((ring: Ring, i: number) => {
      const offset = { // TODO: offset should be calculated based on circle in z direction?
        x: radius/2 - 120*scrollPercent + i, // TODO: make linear equation for this
        // dx: use a multiplier on the x diff to make them the same at 0 and further apart at the peaks
        y: radius + ring.offsetY
      };
      const intersection = ellipseCircleIntersection({
        eRadx: offset.x,
        eRady: offset.y,
        cRad: radius
      });
      this.ctx.beginPath();
      this.ctx.ellipse(x, y, offset.x, offset.y, angle, intersection[0].theta, intersection[1].theta)
      this.ctx.strokeStyle = ColorMixer.toString(ring.color, 0.8);
      this.ctx.lineWidth = ring.lineWidth;
      this.ctx.stroke();
    });
  }
}
