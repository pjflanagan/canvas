<script lang="ts">
  import { onMount } from 'svelte';
  import { getRandomVisual } from '../visuals';

  onMount(() => {
    window.location.href = `/${getRandomVisual().visualLink}`;
  });
</script>
