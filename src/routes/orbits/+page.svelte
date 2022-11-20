<script lang="ts">
	import { onMount } from 'svelte';
	import { createVisualOnMount } from '../../lib/visual';
	import { OrbitsVisual } from '../../visuals';
	import CanvasComponent from '../../components/canvas/CanvasComponent.svelte';
	import ControlsComponent from '../../components/controls/ControlsComponent.svelte';
	import HeaderComponent from '../../components/header/HeaderComponent.svelte';
	import ControlsSectionComponent from '../../components/controls/ControlsSectionComponent.svelte';
	import ButtonControlComponent from '../../components/controls/ButtonControlComponent.svelte';
	import RadioControlComponent from '../../components/controls/RadioControlComponent.svelte';
	import { Mode, MODE_LIST } from '../../visuals/orbits';

	let canvasElement: HTMLCanvasElement;
	let visual: OrbitsVisual;

	let mode: string;

	onMount(() => {
		visual = createVisualOnMount(OrbitsVisual, canvasElement) as OrbitsVisual;
		mode = visual.mode;
	});

	function selectMode(newMode: string) {
		visual.setMode(Mode[newMode as keyof typeof Mode]);
		mode = newMode;
	}

	let isRunning: boolean = true;
	function toggleStopStart() {
		visual.toggleStopStart();
		isRunning = visual.isRunning;
	}
</script>

<HeaderComponent
	title={OrbitsVisual.visualName}
	toggleStopStart={toggleStopStart}
	isRunning={isRunning}
/>
<ControlsComponent>
	<ControlsSectionComponent title="Playback">
		<ButtonControlComponent disabled={false} action={visual?.clearCanvas} label="Clear" />
		<ButtonControlComponent disabled={false} action={visual?.randomize} label="Random" />
	</ControlsSectionComponent>
	<ControlsSectionComponent title="Visual">
		<RadioControlComponent options={MODE_LIST} select={selectMode} selected={mode} />
	</ControlsSectionComponent>
</ControlsComponent>
<CanvasComponent visual={visual} bind:canvasElement={canvasElement} />
