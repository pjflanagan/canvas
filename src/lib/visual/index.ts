import { Visual } from './Visual';

export { Visual };

export function createVisualOnMount(VisualClass: typeof Visual, canvasElement: HTMLCanvasElement): Visual {
  const context = canvasElement.getContext('2d');
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;

  if (!context) {
    throw 'Unable to get canvas context';
  }

  const visual = new VisualClass(context);
  visual.setup();
  visual.start();

  return visual;
}
