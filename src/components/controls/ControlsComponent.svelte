<script lang="ts">
	import { ControlType, type VisualControls } from '$lib/visual/Controls';
	import ButtonControlComponent from './ButtonControlComponent.svelte';
	import RadioControlComponent from './RadioControlComponent.svelte';

	export let visualControls: VisualControls;
</script>

<div class="control-panel">
	{#each visualControls as section}
		<div class="section">
			<div class="section-title">{section.title}</div>
			{#each section.controls as control}
				{#if control.type === ControlType.BUTTON}
          <ButtonControlComponent action={control.action} label={control.label} />
        {:else if control.type === ControlType.RADIO}
          <RadioControlComponent selected={control.selected} options={control.options} select={control.select} />
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	.control-panel {
		z-index: 2;
		position: fixed;
		bottom: 12px;
		left: 12px;

		.section-title {
      font-size: 14px;
      padding: 4px 0;
      opacity: 0.8;
		}
	}
</style>
