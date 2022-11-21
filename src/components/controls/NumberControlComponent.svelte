<script lang="ts">
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import TiPlus from 'svelte-icons-pack/ti/TiPlus';
  import TiMinus from 'svelte-icons-pack/ti/TiMinus';

  export let label: string | undefined = undefined;
  export let value: number;
  export let setValue: (newnNumber: number) => void;
  export let max: number;
  export let min: number;
  export let increment: number = 1;

  function addToValue(delta: number) {
    const newValue = value + delta;
    if (newValue <= max && newValue >= min) {
      setValue(newValue);
    }
  }
</script>

<div class="number-button">
  {#if label}
    <div class="label">
      {label}
    </div>
  {:else}
    <slot />
  {/if}
  <div class="number-change-holder">
    <div
      class="icon"
      on:click={() => addToValue(-increment)}
      on:keydown={() => addToValue(-increment)}
    >
      <Icon src={TiMinus} color="#fff" size="14px" />
    </div>
    <div class="value">
      {value}
    </div>
    <div
      class="icon"
      on:click={() => addToValue(increment)}
      on:keydown={() => addToValue(increment)}
    >
      <Icon src={TiPlus} color="#fff" size="14px" />
    </div>
  </div>
</div>

<style lang="scss">
  .number-button {
    display: flex;
    font-size: 12px;

    .label {
      padding: 4px 4px 4px 0;
      font-size: 12px;
      opacity: 0.4;
    }

    .number-change-holder {
      padding: 4px;
      display: flex;

      .value {
        opacity: 0.4;
      }

      .icon {
        padding: 0 4px;
        cursor: pointer;
        opacity: 0.4;
        transition: opacity 0.2s;

        &:hover {
          opacity: 1;

          // &.disabled {
          //   opacity: 0.2;
          //   cursor: default;
          // }
        }
      }
    }
  }
</style>
