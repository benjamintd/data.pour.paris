<script>
  import { onMount } from "svelte";
  import Github from "./Github.svelte";
  import { slide, fade } from "svelte/transition";

  export let title = "Data Pour Paris";
  export let link = "/";

  let open = true;
  let details = false;
  let shouldRetract = true;

  onMount(() => {
    setTimeout(() => {
      if (shouldRetract) {
        open = false;
        shouldRetract = false;
      }
    }, 7000);
  });
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

  summary {
    user-select: none;
    outline: 0;
  }
</style>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content="Data Pour Paris - {title}" />
  <meta
    property="og:image"
    content="https://data.pour.paris/images/{link}.jpg" />
</svelte:head>

{#if open}
  <div
    transition:fade
    class="absolute pa2 right-0 h-100 w-100 w-33-l z-9999"
    on:click={() => (open = false)}>
    <div
      transition:slide
      class="br1 pa4 pt2 bg-white br1 shadow-2 relative overflow-x-scroll"
      style="max-height: 80vh;"
      on:click={e => e.stopPropagation()}>
      <div
        class="absolute top-0 right-0 ma3 black-60 pointer"
        on:click={() => (open = false)}>
        ✕
      </div>
      <span class="f6">
        <h1>{title}</h1>
      </span>
      <span class="fw2 lh-copy">
        <slot name="gist" />
      </span>
      <details>
        <summary class="dib pointer " on:click={() => (shouldRetract = false)}>
          plus de détails
        </summary>
        <slot name="details" />
        <p class="f6 black-60">
          <slot name="license">Données sous license OdbL.</slot>
        </p>
        <Github />
      </details>
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
