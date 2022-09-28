
export class Random {
  static number(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  static float(min: number, max: number): number  {
    return Math.random() * (max - min) + min;
  }
  
  static boolean(): boolean {
    return Random.odds(0.5);
  }
  
  static odds(likelihood): boolean {
    return Math.random() < likelihood;
  }
  
  static color(a = 1): string {
    var r = Math.round(Math.random() * 255);
    var g = Math.round(Math.random() * 255);
    var b = Math.round(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  static subset<T>(arr: T[], size: number): T[] {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  }
}