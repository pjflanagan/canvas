<script lang="ts">
  import { onMount } from 'svelte';
  import { getRandomTopTierVisual } from '../visuals';

  onMount(() => {
    window.location.href = `/${getRandomTopTierVisual().visualLink}`;
  });
</script>
