import Color from 'color';
import { Random } from './Random';

export class ColorMixer {
  static getRandomColor(a = 0): Color {
    return Color({
      r: Random.number(0, 255),
      g: Random.number(0, 255),
      b: Random.number(0, 255),
    }).opaquer(a);
  }

  static getRandomSimilarColor(originalColor: Color, distance: number): Color {
    const d1 = Random.float(-1, 1) * distance;
    const d2 = Random.float(-1, 1) * (distance - d1);
    const d3 = distance - (d1 + d2);
    const [dr, dg, db] = Random.shuffle([d1, d2, d3]);

    return Color({
      r: originalColor.red() + dr,
      g: originalColor.green() + dg,
      b: originalColor.blue() + db,
    }).opaquer(originalColor.alpha());
  }

  static getAverageColor(c1: Color, c2: Color) {
    return c1.mix(c2);
  }

  static makeSpectrum(c1: Color, c2: Color, colorCount: number): Color[] {
    const colors: Color[] = [c1];
    const delta = {
      r: c2.red() - c1.red(),
      g: c2.green() - c1.green(),
      b: c2.blue() - c1.blue(),
      a: c2.alpha() - c1.alpha(),
    };
    for (let i = 1; i <= colorCount; ++i) {
      colors.push(
          Color({
          r: c1.red() + (delta.r * i) / colorCount,
          g: c1.green() + (delta.g * i) / colorCount,
          b: c1.blue() + (delta.b * i) / colorCount,
        }).opaquer(
          c1.alpha() + (delta.a * i) / colorCount
        )
      );
    }
    return colors;
  }

  static getHueColorString(hueRatio: number): string {
    const hue = Math.floor(360 * hueRatio);
    const sat = 100;
    const lum = 50;
    return 'hsl(' + hue + ',' + sat + '%,' + lum + '%)';
  }
}
