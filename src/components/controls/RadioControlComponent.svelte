<script lang="ts">
  import ButtonControlComponent from './ButtonControlComponent.svelte';

  export let selected: string;
  export let options: string[];
  export let select: (selection: string) => void;
</script>

{#each options as option}
  <ButtonControlComponent
    label={option}
    action={() => select(option)}
    disabled={selected === option}
  />
{/each}
