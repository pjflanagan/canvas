<script lang="ts">
	import { SpaceVisual } from '../visuals/space/index';
	import CanvasComponent from '../components/CanvasComponent.svelte';
	// import { onMount } from 'svelte/types/runtime/internal/lifecycle';
	// import type { Visual } from '$lib/visual';

	// let visual: typeof Visual;

	// onMount(() => {
	//   switch(pageName) {
	//     case 'space':
	//     default:
	//       visual = SpaceVisual;
	//       break;
	//   }
	// })
</script>

<CanvasComponent visual={SpaceVisual} />
