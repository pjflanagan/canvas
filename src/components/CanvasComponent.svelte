<script lang="ts">
	import type { Visual } from '$lib/visual';
	import { onMount } from 'svelte';
	import ScrollerComponent from './ScrollerComponent.svelte';

	export let visual: typeof Visual;

	let canvasElement: HTMLCanvasElement;
	let handleMouseMove: (e: MouseEvent) => void;
  let handleScoll: (scrollY: number) => void;
	let v: Visual;
  let y: number;

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
      handleScoll = v.handleScroll;
			v.setup();
			v.start();
		}
	});
</script>

<svelte:window bind:scrollY={y} on:scroll={() => handleScoll(y)}/>
<ScrollerComponent heightMultiplier={v?.maxScrollHeightFactor || 0} /> 
<canvas bind:this={canvasElement} on:mousemove={handleMouseMove} />

<style lang="scss">
	canvas {
		position: fixed;
		width: 100%;
		height: 100%;
	}
</style>
