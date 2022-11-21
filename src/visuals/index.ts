import { OrbitsVisual } from './orbits';
import { SpaceVisual } from './space';
import { SwarmVisual } from './swarm';
import { FireflyVisual } from './fireflies';
import type { Visual } from '$lib/visual';
import { Random } from '$lib/util';
import { RandomWalkVisual } from './random-walk/RandomWalkVisual';

export const VISUAL_LIST = [SpaceVisual, SwarmVisual, OrbitsVisual, FireflyVisual, RandomWalkVisual];

export function getRandomVisual(): (typeof Visual) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return Random.arrayItem(VISUAL_LIST)!;
}

export { OrbitsVisual, SpaceVisual, SwarmVisual, FireflyVisual, RandomWalkVisual };
