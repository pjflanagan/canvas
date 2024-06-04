<script lang="ts">
  import { BassVisual } from '../../visuals';
  import { onMount } from 'svelte';
  import { createVisualOnMount } from '../../lib/visual';
  import CanvasComponent from '../../components/canvas/CanvasComponent.svelte';
  import HeaderComponent from '../../components/header/HeaderComponent.svelte';

  let canvasElement: HTMLCanvasElement;
  let visual: BassVisual;

  onMount(() => {
    visual = createVisualOnMount(BassVisual, canvasElement) as BassVisual;
  });

  let isRunning = true;
  function toggleStopStart() {
    visual.toggleStopStart();
    isRunning = visual.isRunning;
  }
</script>

<HeaderComponent title={BassVisual.visualName} {toggleStopStart} {isRunning} />
<CanvasComponent {visual} bind:canvasElement />
