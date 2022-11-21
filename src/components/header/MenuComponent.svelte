<script lang="ts">
  import { VISUAL_LIST } from '../../visuals';
  import { fade } from 'svelte/transition';
  // import Icon from 'svelte-icons-pack/Icon.svelte';
  // import TiArrowShuffle from 'svelte-icons-pack/ti/TiArrowShuffle';
</script>

<div id="menu" transition:fade={{ duration: 200 }}>
  {#each VISUAL_LIST as visual}
    <div class="link">
      <a href={visual.visualLink}>{visual.visualName}</a>
    </div>
  {/each}
  <div class="link">
    <a href="/">Random</a>
    <!-- <Icon src={TiArrowShuffle} color="#fff" size="16px" /> -->
  </div>
</div>

<style lang="scss">
  div#menu {
    position: fixed;
    z-index: 101;
    width: 200px;
    height: auto;
    top: 38px;
    font-size: 12px;
    padding: 0 34px;

    div.link {
      padding: 4px 0;
      max-height: 22px;

      a {
        color: #fffa;
        text-decoration: none;
        transition: color 0.2s;

        &:hover {
          color: #fff;
        }
      }
    }
  }
</style>
