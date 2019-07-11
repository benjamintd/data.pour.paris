<script>
  import { currentTimestamp, playing } from "./stores.js";

  let interval = 0;

  $: {
    clearInterval(interval);
    if ($playing) {
      interval = setInterval(() => currentTimestamp.update(n => n + 1), 50);
    }
  }
</script>

<style>
  .button {
    box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.1);
  }

  .button:hover {
    box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.2);
  }

  .button:active {
    transform: translateY(1px);
    box-shadow: 0px 1px 2px 2px rgba(0, 0, 0, 0.2);
  }
</style>

<div class="flex items-center justify-center pa3">
  <div
    class="button flex items-center justify-center br-100 w2 h2 pointer"
    on:click={() => {
      playing.update(p => !p);
    }}>
    {#if $playing}❚❚{:else}►{/if}
  </div>
</div>
