<script lang="ts">
  import { GuitarVisual } from '../../visuals';
  import { onMount } from 'svelte';
  import { createVisualOnMount } from '../../lib/visual';
  import CanvasComponent from '../../components/canvas/CanvasComponent.svelte';
  import HeaderComponent from '../../components/header/HeaderComponent.svelte';

  let canvasElement: HTMLCanvasElement;
  let visual: GuitarVisual;

  onMount(() => {
    visual = createVisualOnMount(GuitarVisual, canvasElement) as GuitarVisual;
  });

  let isRunning = true;
  function toggleStopStart() {
    visual.toggleStopStart();
    isRunning = visual.isRunning;
  }
</script>

<HeaderComponent title={GuitarVisual.visualName} {toggleStopStart} {isRunning} />
<CanvasComponent {visual} bind:canvasElement />
