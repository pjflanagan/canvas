import { Random } from './Random';

export type IColorLegacy = {
  r: number;
  g: number;
  b: number;
  a: number;
};

// TODO: GET RID OF THIS IN FAVOR OF THE COLOR CLASS

export class ColorMixer {
  static hexToColor(hex: string): IColorLegacy | undefined {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: 1,
        }
      : undefined;
  }

  static getRandomColor(a = 1): IColorLegacy {
    return {
      r: Random.number(0, 255),
      g: Random.number(0, 255),
      b: Random.number(0, 255),
      a: a,
    };
  }

  static getRandomSimilarColor(originalColor: IColorLegacy, distance: number): IColorLegacy {
    const d1 = Random.float(-1, 1) * distance;
    const d2 = Random.float(-1, 1) * (distance - d1);
    const d3 = distance - (d1 + d2);
    const [dr, dg, db] = Random.shuffle([d1, d2, d3]);

    return {
      r: originalColor.r + dr,
      g: originalColor.g + dg,
      b: originalColor.b + db,
      a: originalColor.a,
    };
  }

  static getDarkerColor(color: IColorLegacy, darkness: number): IColorLegacy {
    return {
      r: color.r - darkness,
      g: color.g - darkness,
      b: color.b - darkness,
      a: color.a,
    };
  }

  static toString(color: IColorLegacy, opacity?: number): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity ? opacity : color.a})`;
  }

  static getAverageColor(c1: IColorLegacy, c2: IColorLegacy) {
    return {
      r: (c1.r + c2.r) / 2,
      g: (c1.g + c2.g) / 2,
      b: (c1.b + c2.b) / 2,
      a: (c1.a + c2.a) / 2,
    };
  }

  static makeSpectrum(c1: IColorLegacy, c2: IColorLegacy, colorCount: number): IColorLegacy[] {
    const colors: IColorLegacy[] = [c1];
    const delta = {
      r: c2.r - c1.r,
      g: c2.g - c1.g,
      b: c2.b - c1.b,
      a: c2.a - c1.a,
    };
    for (let i = 1; i <= colorCount; ++i) {
      colors.push({
        r: c1.r + (delta.r * i) / colorCount,
        g: c1.g + (delta.g * i) / colorCount,
        b: c1.b + (delta.b * i) / colorCount,
        a: c1.a + (delta.a * i) / colorCount,
      });
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
