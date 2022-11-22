/* eslint-disable @typescript-eslint/no-non-null-assertion */

import Color from "color";
import type { BuildingInstructions } from "./Building";
import { makeBasicSegment } from "./segments/basic-segment";
import { makeTaipei101Base, makeTaipei101Segment, makeTaipei101Spire } from "./segments/taipei101-segment";

export const TAIPEI_101: BuildingInstructions = {
  top: makeTaipei101Spire(Color('#3ff4fb')),
  base: makeTaipei101Base(120, Color('#70b0b3')),
  buildingPattern: [
    makeTaipei101Segment(80, Color('#24e9e2')),
    makeBasicSegment(4, Color('#083060')),
  ],
}
