<script lang="ts">
	export let height: number | undefined;
</script>

<div id="scroller" style={`height: ${height}px`} />

<style lang="scss">
	div#scroller {
		pointer-events: none;
		top: 0;
		position: absolute;
		width: 100%;
	}
</style>
