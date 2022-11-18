<script lang="ts">
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import TiMediaPause from 'svelte-icons-pack/ti/TiMediaPause';
	import TiMediaPlay from 'svelte-icons-pack/ti/TiMediaPlay';
	import TiThMenu from 'svelte-icons-pack/ti/TiThMenu';
	import MenuComponent from './MenuComponent.svelte';

	export let title: string;
	export let toggleStopStart: () => void;
	export let isRunning: boolean;

	let isMenuOpen = false;

	const toggleMenuOpen = () => (isMenuOpen = !isMenuOpen);
</script>

<div id="header">
	<div class="icon menu" on:click={toggleMenuOpen} on:keypress={toggleMenuOpen}>
		<Icon src={TiThMenu} color="#fff" size="14px" />
	</div>
	<div class="title">
		{title}
	</div>
	<div class="icon toggle" on:click={toggleStopStart} on:keypress={toggleStopStart}>
		{#if isRunning}
			<Icon src={TiMediaPause} color="#fff" size="20px" />
		{:else}
			<Icon src={TiMediaPlay} color="#fff" size="20px" />
		{/if}
	</div>
	<!-- <div class="icon">
    <Icon src={TiArrowShuffle} color="#fff" size="20px" />
  </div> -->
	<!-- <div class="icon">
    <Icon src={TiArrowSortedDown} color="#fff" size="20px" />
  </div> -->
</div>
{#if isMenuOpen}
	<MenuComponent />
{/if}

<style lang="scss">
	div#header {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1;
		padding: 12px;

		div.title {
			margin: 0 8px;
			padding: 4px 0 0 0;
			color: #fff;
		}

		div.icon {
			cursor: pointer;
			opacity: 0.4;
			transition: opacity 0.2s;

			&.menu {
				padding: 6px 0 0 0;
			}

			&.toggle {
				padding: 3px 0 0 0;
			}

			&:hover {
				opacity: 1;
			}
		}
	}
</style>
