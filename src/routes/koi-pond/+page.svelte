<script lang="ts">
	import { onMount } from 'svelte';
	import { SwarmVisual } from '../../visuals';
	import CanvasComponent from '../../components/canvas/CanvasComponent.svelte';
	import OverlayComponent from '../../components/OverlayComponent.svelte';
	import { createVisualOnMount } from '../../lib/visual';
	import HeaderComponent from '../../components/header/HeaderComponent.svelte';

	let canvasElement: HTMLCanvasElement;
	let visual: SwarmVisual;

	onMount(() => {
		visual = createVisualOnMount(SwarmVisual, canvasElement) as SwarmVisual;
	});

	let isRunning: boolean = true;
	function toggleStopStart() {
		visual.toggleStopStart();
		isRunning = visual.isRunning;
	}
</script>

<HeaderComponent
	title={SwarmVisual.visualName}
	toggleStopStart={toggleStopStart}
	isRunning={isRunning}
/>
<OverlayComponent>
	<div id="water" />
</OverlayComponent>
<CanvasComponent visual={visual} bind:canvasElement={canvasElement} />

<style lang="scss">
	div#water {
		width: 100%;
		height: 100%;
		background: url(/img/koi-pond.png) repeat;
		background-repeat: repeat;
		background-size: 20%;
		opacity: 0.02;
	}	
</style>

