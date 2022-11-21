<script lang="ts">
  import { onMount } from 'svelte';
  import { createVisualOnMount } from '../../lib/visual';
  import { RandomWalkVisual } from '../../visuals';
  import HeaderComponent from '../../components/header/HeaderComponent.svelte';
  import CanvasComponent from '../../components/canvas/CanvasComponent.svelte';
  import ControlsComponent from '../../components/controls/ControlsComponent.svelte';
  import ControlsSectionComponent from '../../components/controls/ControlsSectionComponent.svelte';
  import ButtonControlComponent from '../../components/controls/ButtonControlComponent.svelte';
  import NumberControlComponent from '../../components/controls/NumberControlComponent.svelte';
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
    setAllProperties();
  });

  function setAllProperties() {
    colorMode = visual.walkProperties.colorMode;
    restartWhenEdgeReached = visual.walkProperties.restartWhenEdgeReached;
    fadeOut = visual.walkProperties.fadeOut;
    backgroundOpacity = visual.walkProperties.backgroundOpacity;
    stepLength = visual.walkProperties.stepLength;
    stepWidth = visual.walkProperties.stepWidth;
  }

  function selectColorMode(newMode: string) {
    visual.walkProperties.colorMode = ColorMode[newMode as keyof typeof ColorMode];
    colorMode = newMode;
  }

  function setBackgroundOpacity(newOpacity: number) {
    visual.walkProperties.backgroundOpacity = parseFloat(newOpacity.toFixed(2));
    backgroundOpacity = visual.walkProperties.backgroundOpacity;
  }

  function setStepLength(newLength: number) {
    visual.walkProperties.stepLength = newLength;
    stepLength = visual.walkProperties.stepLength;
  }

  function setStepWidth(newStepWidth: number) {
    visual.walkProperties.stepWidth = newStepWidth;
    stepWidth = visual.walkProperties.stepWidth;
  }

  function toggleRestartAtEdgeReached() {
    visual.walkProperties.restartWhenEdgeReached = !restartWhenEdgeReached;
    restartWhenEdgeReached = visual.walkProperties.restartWhenEdgeReached;
  }

  function toggleFadeOut() {
    visual.walkProperties.fadeOut = !fadeOut;
    fadeOut = visual.walkProperties.fadeOut;
  }

  function randomize() {
    visual.randomize();
    setAllProperties();
  }

  let isRunning = true;
  function toggleStopStart() {
    visual.toggleStopStart();
    isRunning = visual.isRunning;
  }
</script>

<HeaderComponent title={RandomWalkVisual.visualName} {toggleStopStart} {isRunning} />
<ControlsComponent>
  <ControlsSectionComponent title="Playback">
    <ButtonControlComponent disabled={false} action={randomize} label="Random" />
    <ButtonControlComponent disabled={false} action={visual?.restartCurrentWalk} label="Restart" />
  </ControlsSectionComponent>
  <ControlsSectionComponent title="Walk Settings">
    <ButtonControlComponent
      disabled={false}
      action={toggleRestartAtEdgeReached}
      label={restartWhenEdgeReached ? 'Finite' : 'Infinite'}
    />
    <NumberControlComponent
      label="Length"
      value={stepLength}
      setValue={setStepLength}
      min={5}
      max={100}
    />
    <NumberControlComponent
      label="Width"
      value={stepWidth}
      setValue={setStepWidth}
      min={1}
      max={100}
    />
  </ControlsSectionComponent>
  <ControlsSectionComponent title="Visual Settings">
    <NumberControlComponent
      value={backgroundOpacity}
      setValue={setBackgroundOpacity}
      increment={0.01}
      min={0.01}
      max={0.15}
    >
      <ButtonControlComponent
        disabled={false}
        action={toggleFadeOut}
        label={fadeOut ? 'Fade' : 'Draw'}
      />
    </NumberControlComponent>
  </ControlsSectionComponent>
  <ControlsSectionComponent title="Color Mode">
    <RadioControlComponent
      options={COLOR_MODE_LIST}
      select={selectColorMode}
      selected={colorMode}
    />
  </ControlsSectionComponent>
</ControlsComponent>
<CanvasComponent {visual} bind:canvasElement />
