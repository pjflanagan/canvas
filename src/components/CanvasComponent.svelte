<script lang="ts">
	import type { Visual } from "$lib/visual";
	import { onMount } from "svelte";

  export let visual: typeof Visual;

  let canvasElement: HTMLCanvasElement;
  let handleMouseMove: (e: MouseEvent) => void;
  let v: Visual;

  onMount(() => {
    if (!v) {
      const context = canvasElement.getContext('2d');
      canvasElement.width = window.innerWidth;
      canvasElement.height = window.innerHeight;

      if (!context) {
        throw 'Unable to get canvas context';
      }

      v = new visual(context);
      handleMouseMove = v.handleMouseMove;
      v.setup();
      v.start();
    }
  });
  
</script>

<!-- <svelte:window bind:scrollY={y}/> -->
<canvas
  bind:this={canvasElement}
  on:mousemove={handleMouseMove}
/>
