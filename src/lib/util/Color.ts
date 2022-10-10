import { Random } from "./Random";

export type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
}

export class ColorMixer {
  static getRandomColor(a = 1): Color {
    return {
      r: Random.number(0, 255),
      g: Random.number(0, 255),
      b: Random.number(0, 255),
      a: a !== undefined ? a : Random.float(0, 1)
    };
  }

  static getRandomSimilarColor(originalColor: Color, distance: number): Color {
    const d1 = Random.float(-1, 1) * distance;
    const d2 = Random.float(-1, 1) * (distance - d1);
    const d3 = distance - (d1 + d2);
    const [dr, dg, db] = Random.shuffle([d1, d2, d3]);

    return {
      r: originalColor.r + dr,
      g: originalColor.g + dg,
      b: originalColor.b + db,
      a: originalColor.a
    }
  }

  static toString(color: Color, opacity?: number): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity ? opacity : color.a})`;
  }

  static getAverageColor(c1: Color, c2: Color) {
    return {
      r: (c1.r + c2.r) / 2,
      g: (c1.g + c2.g) / 2,
      b: (c1.b + c2.b) / 2,
      a: (c1.a + c2.a) / 2,
    };
  }

  static makeSpectrum(c1: Color, c2: Color, colorCount: number): Color[] {
    const colors: Color[] = [c1];
    const delta = {
      r: c2.r - c1.r,
      g: c2.g - c1.g,
      b: c2.b - c1.b,
      a: c2.a - c1.a,
    };
    for (let i = 1; i <= colorCount; ++i) {
      colors.push(
        {
          r: c1.r + (delta.r * i) / colorCount,
          g: c1.g + (delta.g * i) / colorCount,
          b: c1.b + (delta.b * i) / colorCount,
          a: c1.a + (delta.a * i) / colorCount,
        }
      );
    }
    return colors;
  }
}
