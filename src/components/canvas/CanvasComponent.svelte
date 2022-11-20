<script lang="ts">
	import type { Visual } from '$lib/visual';
	import { onDestroy } from 'svelte';
	import ScrollerComponent from './ScrollerComponent.svelte';

	export let canvasElement: HTMLCanvasElement;
	export let visual: Visual;

	let scrollY: number;

	onDestroy(() => {
		visual?.stop();
	});
</script>

<svelte:window
	bind:scrollY={scrollY}
	on:scroll={() => visual.handleScroll(scrollY)}
/>
<ScrollerComponent height={visual?.maxScrollHeight} />
<canvas
	bind:this={canvasElement}
	on:mousemove={visual.handleMouseMove}
	on:mousedown={visual.handleMouseDown}
/>

<style lang="scss">
	canvas {
		position: fixed;
		width: 100%;
		height: 100%;
	}
</style>
