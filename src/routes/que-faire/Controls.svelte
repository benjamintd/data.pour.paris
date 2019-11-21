<script>
  import { onMount } from "svelte";
  import { slide, fade } from "svelte/transition";
  import { featureCollection, selectedFeature } from "./stores.js";

  let info = null;

  // @todo add filters

  $: {
    const feature = $featureCollection.features.find(
      f => f.properties.id === $selectedFeature
    );
    if (feature) {
      info = { ...feature.properties };
    } else {
      info = null;
    }
    if (typeof window !== "undefined") {
      if ($selectedFeature !== -1) {
        window
          .fetch(
            `https://datapourparis.benjamintd.now.sh/api/que-faire/event?id=${$selectedFeature}`
          )
          .then(res => res.json())
          .then(f => {
            if (f.properties.id == $selectedFeature) {
              info = f.properties;
            }
          });

        window.history.pushState(
          {},
          feature ? feature.properties.title : "Que Faire à Paris ?",
          `que-faire/${$selectedFeature}`
        );
      } else {
        window.history.pushState({}, "Que Faire à Paris ?", `que-faire`);
      }
    }
  }
</script>

<style>
  .min-h3 {
    min-height: 4rem;
  }
</style>

<div
  class={`absolute w-50-l w-100 flex flex-column z-2 shadow-2 overflow-hidden ${info ? 'h-100' : ''}`}
  style="max-height: 100%; flex: 0 0 auto;">
  <div class="bg-light-gray h3 min-h3" />
  {#if info}
    <div
      class="w-100 z-2 flex-grow-1 flex flex-column bg-white pa3 relative"
      style="flex: 1 1 auto; overflow-y: auto"
      transition:slide>
      <div
        class="absolute right-0 top-0 ma3 pointer"
        on:click={() => selectedFeature.set(-1)}>
        ✕
      </div>
      <h1 class="tc">{info.title}</h1>
      <div
        class="bg-black-05 bt bl br pa2 z-3 flex justify-between items-center"
        style="border-color: {info.cover && info.cover.color_summary ? info.cover.color_summary[0] : '#222222'};">
        {#if info.price_type}
          <div
            title={info.price_detail}
            class="br-pill bg-gray gray white ph2 pv1">
            💵{info.price_type}
          </div>
        {/if}
        {#if info.address_name}
          <div
            class="br-pill bg-gray gray white ph2 pv1"
            title={info.address_street}>
            📍{info.address_name}
          </div>
        {/if}
        <div>
          <a href="https://quefaire.paris.fr/{info.id}">Voir sur paris.fr</a>
        </div>
      </div>
      <!-- @todo add a recap div with date_description and price_type, tags, address, transport -->
      {#if info.cover}
        <div
          class="w-100 relative flex justify-center"
          style="padding-bottom: {(100 * info.cover.height) / info.cover.width}%;
          background-color: {info.cover.color_summary[0]};">
          <div
            class="absolute w-100 h-100"
            style="background: 50% 50% / contain no-repeat url('{info.cover_url}');" />
          <div
            class="absolute w-100 h-100"
            style="backdrop-filter: blur(50px);" />
          <div
            class="absolute w-100 h-100"
            style="background: 50% 50% / contain no-repeat url('{info.cover_url}');
            max-width: {info.cover.width}px;" />
        </div>
      {/if}
      {#if info.lead_text}
        <p class="b">{info.lead_text}</p>
      {/if}
      {#if info.description}
        <div in:fade class="fw2 lh-copy">
          {@html info.description}
        </div>
      {/if}
      {#if info.date_description}
        <div in:fade class="w-100 br2 ba mt2 pa2 f6 b fw3">
          {@html info.date_description}
        </div>
      {/if}
    </div>
  {/if}
</div>
