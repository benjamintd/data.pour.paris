<script>
  import Github from "./Github.svelte";
  import { slide, fade } from "svelte/transition";

  let open = false;
</script>

<style>
  .modal {
    background-color: rgba(0, 0, 0, 0.5);
  }

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

{#if open}
  <div
    transition:fade
    class="modal absolute w-100 h-100 flex items-center justify-center z-9999
    pa4"
    on:click={() => (open = false)}>
    <div
      transition:slide
      class="pa4 bg-white br1 shadow-1 relative overflow-x-scroll"
      style="max-height: 80vh;"
      on:click={e => e.stopPropagation()}>
      <div
        class="absolute top-0 right-0 ma3 black-60 pointer"
        on:click={() => (open = false)}>
        ✕
      </div>
      <slot />
      <p class="f6 black-60">
        <slot name="license">Données sous license OdbL.</slot>
      </p>
      <Github />

    </div>
  </div>
{:else}
  <div
    class="button absolute top-0 right-0 ma3 br-100 bg-white shadow-1 z-999 w2
    h2 flex items-center justify-center pointer f5 fw6"
    on:click={() => (open = true)}>
    i
  </div>
{/if}
