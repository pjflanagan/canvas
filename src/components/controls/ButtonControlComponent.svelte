<script lang="ts">
	export let action: () => void;
  export let label: string;
  export let disabled: boolean;

  function handleClick() {
    if (!disabled) {
      action();
    }
  }
</script>

<div
  class={`control-button ${disabled ? 'disabled' : ''}`}
  on:click={handleClick}
  on:keydown={handleClick}
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

      &.disabled {
        opacity: 0.2;
        cursor: default;
      }
    }

    &.disabled {
      opacity: 0.2;
      cursor: default;
    }
  }
</style>
