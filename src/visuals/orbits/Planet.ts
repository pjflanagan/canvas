import { ColorMixer, Geometry, Random, type IColorLegacy, type Point } from '$lib/util';
import { getModeProperties, LineMode, type OrbitsVisual } from './OrbitsVisual';

const PLANET = {
  ORBIT_SPEED: { min: 0.005, max: 0.03 },
  ORBIT_RADIUS_GAP: 200,
  DRAW_LINE_TICK: { min: 1, max: 6 },
};

export class Planet {
  visual: OrbitsVisual;
  id: number;
  ctx: CanvasRenderingContext2D;
  color: IColorLegacy;
  orbit: {
    radius: number;
    angularVelocity: number;
    drawTick: number; // frequency the line is drawn
  };
  p: Point & {
    angle: number;
    tick: number;
  };

  constructor(visual: OrbitsVisual, id: number) {
    this.visual = visual;
    const { W, H } = this.visual.getSize();
    this.ctx = this.visual.getContext();
    this.id = id;
    this.color = ColorMixer.getRandomColor();

    const direction = Random.boolean() ? 1 : -1;
    const angularVelocity = direction * Random.propFloat(PLANET.ORBIT_SPEED);
    const radius = Random.number(PLANET.ORBIT_RADIUS_GAP, W - PLANET.ORBIT_RADIUS_GAP) / 2;
    const drawTick = Random.propNumber(PLANET.DRAW_LINE_TICK);

    const angle = Random.float(0, 2 * Math.PI);
    const x = W / 2 + radius * Math.cos(angle);
    const y = H / 2 + radius * Math.sin(angle);

    this.orbit = { radius, angularVelocity, drawTick };
    this.p = { x, y, angle, tick: 0 };
  }

  move() {
    const { W, H } = this.visual.getSize();
    const newAngle = this.p.angle + this.orbit.angularVelocity;
    this.p = {
      x: W / 2 + this.orbit.radius * Math.cos(newAngle),
      y: H / 2 + this.orbit.radius * Math.sin(newAngle),
      angle: newAngle,
      tick: this.p.tick + 1,
    };

    if (this.p.tick === this.orbit.drawTick) {
      this.p.tick = 0;
    }
  }

  draw() {
    const { W, H } = this.visual.getSize();
    const modeProperties = getModeProperties(this.visual.mode);

    // orbit
    if (modeProperties.ORBITS) {
      this.ctx.beginPath();
      this.ctx.arc(W / 2, H / 2, this.orbit.radius, 0, 2 * Math.PI, false);
      this.ctx.strokeStyle = '#FFF1';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    // planet
    if (modeProperties.PLANETS) {
      this.ctx.beginPath();
      this.ctx.arc(this.p.x, this.p.y, 6, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = ColorMixer.toString(this.color, 1);
      this.ctx.fill();
    }
  }

  shouldDrawLine(lineMode: LineMode) {
    return (
      lineMode === LineMode.ON || // if the line mode is on
      (lineMode === LineMode.TICKS && this.p.tick === 0) // or set to ticks and it is time
    );
  }

  drawLine(planet2: Planet) {
    const modeProperties = getModeProperties(this.visual.mode);

    // line (if line mode is ON || is TICKS and should draw this tick)
    if (this.shouldDrawLine(modeProperties.LINES)) {
      const grd = this.ctx.createLinearGradient(this.p.x, this.p.y, planet2.p.x, planet2.p.y);
      grd.addColorStop(0, ColorMixer.toString(this.color, 0.1));
      grd.addColorStop(1, ColorMixer.toString(planet2.color, 0.1));
      this.ctx.beginPath();
      this.ctx.moveTo(this.p.x, this.p.y);
      this.ctx.lineTo(planet2.p.x, planet2.p.y);
      this.ctx.strokeStyle = grd;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    if (modeProperties.MIDPOINTS) {
      // midpoint
      const midX = (this.p.x + planet2.p.x) / 2;
      const midY = (this.p.y + planet2.p.y) / 2;
      const aveColor = ColorMixer.getAverageColor(this.color, planet2.color);
      this.ctx.beginPath();
      this.ctx.arc(midX, midY, 2, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = ColorMixer.toString(aveColor, 0.9);
      this.ctx.fill();

      // far point
      const aveColorFar = ColorMixer.getAverageColor(planet2.color, aveColor);
      this.ctx.beginPath();
      this.ctx.arc((midX + planet2.p.x) / 2, (midY + planet2.p.y) / 2, 1, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = ColorMixer.toString(aveColorFar, 0.8);
      this.ctx.fill();

      // close point
      const aveColorClose = ColorMixer.getAverageColor(this.color, aveColor);
      this.ctx.beginPath();
      this.ctx.arc((midX + this.p.x) / 2, (midY + this.p.y) / 2, 1, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = ColorMixer.toString(aveColorClose, 0.8);
      this.ctx.fill();
    }
  }

  drawSecondLine(planet2: Planet, planet3: Planet) {
    const modeProperties = getModeProperties(this.visual.mode);
    if (!this.shouldDrawLine(modeProperties.SECONDARY)) return;
    const mid2X = (this.p.x + planet2.p.x) / 2;
    const mid2Y = (this.p.y + planet2.p.y) / 2;
    const mid3X = (this.p.x + planet3.p.x) / 2;
    const mid3Y = (this.p.y + planet3.p.y) / 2;
    const aveX = (mid2X + mid3X) / 2;
    const aveY = (mid2Y + mid3Y) / 2;
    const aveColor = ColorMixer.getAverageColor(planet2.color, planet3.color);
    const opacity =
      Geometry.distance(this.p, { x: aveX, y: aveY }) / this.visual.getSize().H + 0.05;
    const grd = this.ctx.createLinearGradient(this.p.x, this.p.y, aveX, aveY);
    grd.addColorStop(0, ColorMixer.toString(this.color, opacity));
    grd.addColorStop(1, ColorMixer.toString(aveColor, opacity));

    this.ctx.beginPath();
    this.ctx.moveTo(mid2X, mid2Y);
    this.ctx.lineTo(mid3X, mid3Y);
    this.ctx.strokeStyle = grd;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  drawTriangle(planet2: Planet, planet3: Planet) {
    const opMidX = (planet2.p.x + planet3.p.x) / 2;
    const opMidY = (planet2.p.y + planet3.p.y) / 2;
    const opAveColor = ColorMixer.getAverageColor(planet2.color, planet3.color);
    const grd = this.ctx.createLinearGradient(this.p.x, this.p.y, opMidX, opMidY);
    grd.addColorStop(0, ColorMixer.toString(this.color, 0.6));
    grd.addColorStop(1, ColorMixer.toString(opAveColor, 0.6));
    this.ctx.beginPath();
    this.ctx.moveTo(this.p.x, this.p.y);
    this.ctx.lineTo(planet2.p.x, planet2.p.y);
    this.ctx.lineTo(planet3.p.x, planet3.p.y);
    this.ctx.fillStyle = grd;
    this.ctx.fill();
  }
}
