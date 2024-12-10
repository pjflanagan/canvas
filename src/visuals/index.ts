import type { Visual } from '$lib/visual';
import { Random } from '$lib/util';

import { OrbitsVisual } from './orbits';
import { SpaceVisual } from './space';
import { SwarmVisual } from './swarm';
import { FireflyVisual } from './fireflies';
import { RandomWalkVisual } from './random-walk/RandomWalkVisual';
import { CityVisual } from './city/CityVisual';
import { GuitarVisual } from './guitar';
import { BambooVisual } from './bamboo';

export const VISUAL_LIST = [
  SpaceVisual,
  SwarmVisual,
  RandomWalkVisual,
  OrbitsVisual,
  FireflyVisual,
  CityVisual,
  GuitarVisual,
  // BambooVisual // TODO: fix, when the page is loaded directly, the page is blank
];

export function getRandomVisual(): typeof Visual {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return Random.arrayItem(VISUAL_LIST)!;
}

export function getRandomTopTierVisual(): typeof Visual {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return Random.arrayItem([SpaceVisual, SwarmVisual, CityVisual])!;
}

export { OrbitsVisual, SpaceVisual, SwarmVisual, FireflyVisual, RandomWalkVisual, CityVisual, GuitarVisual, BambooVisual };
