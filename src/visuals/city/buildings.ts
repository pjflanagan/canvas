/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Color } from "$lib/util";
import type { BuildingInstructions } from "./Building";
import { makeBasicSegment } from "./segments/lined-window-segment";
import { makeTaipei101Segment, makeTaipei101Spire } from "./segments/taipei101-segment";

export const TAIPEI_101: BuildingInstructions = {
  top: makeTaipei101Spire(Color.hexToColor('#3ff4fb')!),
  buildingPattern: [
    makeTaipei101Segment(80, Color.hexToColor('#24e9e2')!),
    makeBasicSegment(4, Color.hexToColor('#083060')!),
  ],
}
