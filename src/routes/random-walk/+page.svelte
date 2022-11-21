<script lang="ts">
	import { onMount } from 'svelte';
	import { createVisualOnMount } from '../../lib/visual';
	import { RandomWalkVisual } from '../../visuals';
	import CanvasComponent from '../../components/canvas/CanvasComponent.svelte';
	import ControlsComponent from '../../components/controls/ControlsComponent.svelte';
	import HeaderComponent from '../../components/header/HeaderComponent.svelte';
	import ControlsSectionComponent from '../../components/controls/ControlsSectionComponent.svelte';
	import ButtonControlComponent from '../../components/controls/ButtonControlComponent.svelte';
	import RadioControlComponent from '../../components/controls/RadioControlComponent.svelte';
	import { ColorMode, COLOR_MODE_LIST } from '../../visuals/random-walk/RandomWalkVisual';

	let canvasElement: HTMLCanvasElement;
	let visual: RandomWalkVisual;

  let stepLength: number;
  let stepWidth: number;
  let backgroundOpacity: number;
  let restartWhenEdgeReached: boolean;
  let fadeOut: boolean;
  let colorMode: string;

	onMount(() => {
		visual = createVisualOnMount(RandomWalkVisual, canvasElement) as RandomWalkVisual;
		colorMode = visual.walkProperties.colorMode;
		restartWhenEdgeReached = visual.walkProperties.restartWhenEdgeReached;
		fadeOut = visual.walkProperties.fadeOut;
	});

	function selectColorMode(newMode: string) {
		visual.walkProperties.colorMode = ColorMode[newMode as keyof typeof ColorMode];
		colorMode = newMode;
	}

	function toggleRestartAtEdgeReached() {
		visual.walkProperties.restartWhenEdgeReached = !restartWhenEdgeReached
		restartWhenEdgeReached = !restartWhenEdgeReached;
	}


	function toggleFadeOut() {
		visual.walkProperties.fadeOut = !fadeOut
		fadeOut = !fadeOut;
	}

	let isRunning: boolean = true;
	function toggleStopStart() {
		visual.toggleStopStart();
		isRunning = visual.isRunning;
	}
</script>

<HeaderComponent
	title={RandomWalkVisual.visualName}
	toggleStopStart={toggleStopStart}
	isRunning={isRunning}
/>
<ControlsComponent>
	<ControlsSectionComponent title="Playback">
		<ButtonControlComponent disabled={false} action={visual?.randomize} label="Random" />
		<ButtonControlComponent disabled={false} action={visual?.restartCurrentWalk} label="Restart" />
	</ControlsSectionComponent>
	<ControlsSectionComponent title="Walk Settings">
		<ButtonControlComponent disabled={false} action={toggleRestartAtEdgeReached} label={restartWhenEdgeReached ? 'Finite' : 'Infinite'} />
	</ControlsSectionComponent>
	<ControlsSectionComponent title="Visual Settings">
		<ButtonControlComponent disabled={false} action={toggleFadeOut} label={fadeOut ? 'Fade' : 'Draw'} />
	</ControlsSectionComponent>
	<ControlsSectionComponent title="Color Mode">
		<RadioControlComponent options={COLOR_MODE_LIST} select={selectColorMode} selected={colorMode} />
	</ControlsSectionComponent>
</ControlsComponent>
<CanvasComponent visual={visual} bind:canvasElement={canvasElement} />
