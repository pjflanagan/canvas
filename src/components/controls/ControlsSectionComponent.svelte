<script lang="ts">
	export let title: string;
</script>

<div class="section">
	<div class="section-title">{title}</div>
	<slot />
</div>

<style lang="scss">
	.section-title {
		font-size: 14px;
		padding: 4px 0;
		opacity: 0.8;
	}
</style>
