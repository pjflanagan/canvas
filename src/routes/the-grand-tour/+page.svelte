<script lang="ts">
	import { SpaceVisual } from '../../visuals';
	import { onMount } from 'svelte';
	import { createVisualOnMount } from '../../lib/visual';
	import CanvasComponent from '../../components/canvas/CanvasComponent.svelte';
	import HeaderComponent from '../../components/header/HeaderComponent.svelte';

	let canvasElement: HTMLCanvasElement;
	let visual: SpaceVisual;

	onMount(() => {
		visual = createVisualOnMount(SpaceVisual, canvasElement) as SpaceVisual;
	});

	let isRunning: boolean = true;
	function toggleStopStart() {
		visual.toggleStopStart();
		isRunning = visual.isRunning;
	}
</script>

<HeaderComponent
	title={SpaceVisual.visualName}
	toggleStopStart={toggleStopStart}
	isRunning={isRunning}
/>
<CanvasComponent visual={visual} bind:canvasElement={canvasElement} />
