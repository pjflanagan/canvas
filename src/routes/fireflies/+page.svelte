<script lang="ts">
	import { FireflyVisual } from '../../visuals';
	import { onMount } from 'svelte';
	import { createVisualOnMount } from '../../lib/visual';
	import CanvasComponent from '../../components/canvas/CanvasComponent.svelte';
	import HeaderComponent from '../../components/header/HeaderComponent.svelte';

	let canvasElement: HTMLCanvasElement;
	let visual: FireflyVisual;

	onMount(() => {
		visual = createVisualOnMount(FireflyVisual, canvasElement) as FireflyVisual;
	});

	let isRunning: boolean = true;
	function toggleStopStart() {
		visual.toggleStopStart();
		isRunning = visual.isRunning;
	}
</script>

<HeaderComponent
	title={FireflyVisual.visualName}
	toggleStopStart={toggleStopStart}
	isRunning={isRunning}
/>
<CanvasComponent visual={visual} bind:canvasElement={canvasElement} />
