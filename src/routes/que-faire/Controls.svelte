<script>
  import { onMount } from "svelte";
  import { featureCollection, selectedFeature } from "./stores.js";

  let info = null;
  let title = "";
  let cover = null;
  let coverUrl = "";
  let leadText = "";
  let description = "";
  let tags = [];
  let priceType = "";
  let address = "";
  let url = "";

  $: {
    const feature = $featureCollection.features[$selectedFeature];
    if (feature) {
      info = { ...feature.properties };
      console.log(feature);
    } else {
      info = null;
    }
  }
</script>

<style>
  .min-h3 {
    min-height: 4rem;
  }
</style>

<div
  class="w-50 h-100 z-2 shadow-2 overflow-hidden flex flex-column"
  style="flex: 0 0 auto;">
  <div class="bg-black-05 h3 min-h3" />
  {#if info}
    <div class="pa3" style="flex: 1 1 auto; overflow-y: auto">
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
      <p class="b">{info.lead_text}</p>
      {#if info.description}
        <div class="fw2 lh-copy">
          {@html info.description}
        </div>
      {/if}
      {#if info.date_description}
        <div class="w-100 br2 ba mt2 pa2 f6 b fw3">
          {@html info.date_description}
        </div>
      {/if}
    </div>
  {/if}
</div>
