<script>
  import Map from "./Map.svelte";
  import Controls from "./Controls.svelte";
  import Spinner from "../../components/Spinner.svelte";
  import HomeLink from "../../components/HomeLink.svelte";
  import Info from "../../components/Info.svelte";
  import { featureCollection, selectedFeature } from "./stores.js";
</script>

{#if $featureCollection.features.length === 0 && $selectedFeature === -1}
  <Spinner />
{:else}
  <HomeLink />
{/if}

<div class="flex flex-row aspect-ratio--object">
  <Controls />
  <Map />
</div>
