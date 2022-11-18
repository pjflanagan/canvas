<script lang="ts">
	import { SwarmVisual } from '../../visuals';
	import CanvasComponent from '../../components/canvas/CanvasComponent.svelte';
	import OverlayComponent from '../../components/OverlayComponent.svelte';
</script>

<OverlayComponent>
	<div id="water" />
</OverlayComponent>
<CanvasComponent visual={SwarmVisual} />

<style lang="scss">
	div#water {
		width: 100%;
		height: 100%;
		background: url(/img/koi-pond.png) repeat;
		background-repeat: repeat;
		background-size: 20%;
		opacity: 0.02;
	}	
</style>