import type { Point } from '$lib/util';

export class Molecule {
	size: number;
	influenceRadius: number;
	position: Point;
	to: Point;
	maxSpeed: number;

	// TODO: get molecules to be attacted to each other
	// then get them to be rappeled by others,
	// then get them to flee if the cluster is too large
}
