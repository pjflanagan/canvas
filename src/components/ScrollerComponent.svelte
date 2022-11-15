<script lang="ts">
  export let heightMultiplier: number;

  console.log(heightMultiplier);
</script>

<div id="scroller" style={`height: calc(100% * ${heightMultiplier})`} />

<style lang="scss">
  div#scroller {
    pointer-events: none;
    top: 0;
    position: absolute;
    width: 100%;
  }
</style>