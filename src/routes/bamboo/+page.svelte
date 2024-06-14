<script lang="ts">
  import { BambooVisual } from '../../visuals';
  import { onMount } from 'svelte';
  import { createVisualOnMount } from '../../lib/visual';
  import CanvasComponent from '../../components/canvas/CanvasComponent.svelte';
  import HeaderComponent from '../../components/header/HeaderComponent.svelte';

  let canvasElement: HTMLCanvasElement;
  let visual: BambooVisual;

  onMount(() => {
    visual = createVisualOnMount(BambooVisual, canvasElement) as BambooVisual;
  });

  let isRunning = true;
  function toggleStopStart() {
    visual.toggleStopStart();
    isRunning = visual.isRunning;
  }
</script>

<HeaderComponent title={BambooVisual.visualName} {toggleStopStart} {isRunning} />
<CanvasComponent {visual} bind:canvasElement />
