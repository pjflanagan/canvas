import { Color, type IColor } from './Color';

type RangeProperty = { min: number; max: number }
export class Random {
	// max is exclusive
	static number(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	static prop({ min, max }: RangeProperty, comp = 1): number {
		return Random.float(min, max) * comp;
	}

	static float(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	static boolean(): boolean {
		return Random.odds(0.5);
	}

	static odds(likelihood: number): boolean {
		return Math.random() < likelihood;
	}

	static color(a = 1): IColor {
		return Color.getRandomColor(a);
	}

	static arrayItemWeighted<T>(arr: T[], weigths: number[]): T | undefined {
		if (arr.length === 0) {
			return undefined;
		}
		const selectionArray: T[] = [];
		weigths.forEach((w, index) => {
			for (let i = 0; i < w; ++i) {
				selectionArray.push(arr[index]);
			}
		});
		return Random.arrayItem(selectionArray);
	}

	static arrayItem<T>(arr: T[]): T | undefined {
		if (arr.length === 0) {
			return undefined;
		}
		return arr[Random.number(0, arr.length)];
	}

	static subset<T>(arr: T[], size: number): T[] {
		const shuffled = arr.slice(0);
		let i = arr.length;
		let temp: T;
		let index: number;
		while (i--) {
			index = Math.floor((i + 1) * Math.random());
			temp = shuffled[index];
			shuffled[index] = shuffled[i];
			shuffled[i] = temp;
		}
		return shuffled.slice(0, size);
	}

	static shuffle<T>(array: T[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

	static insert<T>(array: T[], value: T): T[] {
		array.splice(Random.number(0, array.length), 0, value);
		return array;
	}
}
