<div id="overlay">
  <slot />
</div>

<style lang="scss">
	div#overlay {
		z-index: 1;
		top: 0;
		left: 0;
		position: fixed;
		height: 100%;
		width: 100%;
		pointer-events: none;
	}
</style>
