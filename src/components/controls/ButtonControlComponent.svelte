<script lang="ts">
	export let action: () => void;
  export let label: string;
</script>

<div
  class="control-button"
  on:click={action}
  on:keydown={action}
>
  {label}
</div>

<style lang="scss">
	.control-button {
    font-size: 12px;
    padding: 4px 0;
    cursor: pointer;
			opacity: 0.4;
			transition: opacity 0.2s;

    &:hover {
				opacity: 1;
    }
  }
</style>
