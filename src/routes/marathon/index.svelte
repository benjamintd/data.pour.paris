<script>
  import Map from "./Map.svelte";
  import Controls from "./Controls.svelte";
  import Spinner from "../../components/Spinner.svelte";
  import HomeLink from "../../components/HomeLink.svelte";
  import Info from "../../components/Info.svelte";
  import { featureCollection } from "./stores.js";
</script>

{#if $featureCollection.features.length === 0}
  <Spinner />
{:else}
  <HomeLink />
{/if}

<Info>
  <h1>marathon</h1>
  <p>
    Visualisez la trace de tous les finishers du Marathon de Paris 2018, ainsi
    que la densité de coureurs au long du parcours au fil du temps.
  </p>
  <p slot="license">
    Données anonymisées et aggrégées depuis l'API de RTRT (Reat-Time Race
    Tracking), partenaire du Schneider Electric Marathon de Paris 2018.
  </p>
</Info>

<div class="flex flex-column aspect-ratio--object">
  <Map />
  <Controls />
</div>
