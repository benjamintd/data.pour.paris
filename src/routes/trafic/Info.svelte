<script>
  import Github from "./Github.svelte";

  let open = false;
</script>

<style>
  .modal {
    background-color: rgba(0, 0, 0, 0.2);
  }
</style>

{#if open}
  <div
    class="modal absolute w-100 h-100 flex items-center justify-center z-999 pa4"
    on:click={() => (open = false)}>
    <div
      class="pa4 bg-white br1 shadow-1 relative overflow-x-scroll"
      style="max-height: 80vh;"
      on:click={e => e.stopPropagation()}>
      <div
        class="absolute top-0 right-0 ma3 black-60 pointer"
        on:click={() => (open = false)}>
        ✕
      </div>
      <slot />
      <a href="https://github.com/benjamintd/open-data-paris">
        <div class="w1 h1">
          <Github />
        </div>
      </a>
    </div>
  </div>
{:else}
  <div
    class="absolute top-0 right-0 ma3 br-100 bg-white shadow-1 z-999 w2 h2 flex
    items-center justify-center pointer"
    on:click={() => (open = true)}>
    <strong>i</strong>
  </div>
{/if}
