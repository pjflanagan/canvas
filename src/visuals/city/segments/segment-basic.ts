import Color from 'color';
import type { Segment, SegmentProperties } from '../segmentUtils';
import { BUILDING_WIDTH } from '../const';
import { makeVerticalStripedSection } from './segment-verticalStripe';

export function makeBasicSegment({
  height = 30,
  color = Color('#70b0b3'),
  topWidth = BUILDING_WIDTH,
  bottomWidth = BUILDING_WIDTH,
}: SegmentProperties): Segment {
  const verticalStripedSection = makeVerticalStripedSection({
    height,
    color,
    topWidth,
    bottomWidth,
    stripeCount: 0
  });
  verticalStripedSection.name = 'basicSegment';
  return verticalStripedSection;
}
