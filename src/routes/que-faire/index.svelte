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

<Info title="Que faire à Paris ?" link="trafic">
  <p slot="gist">Voici la liste des événements et activités à Paris.</p>
  <div slot="details">
    <p>
      Les données proviennent de Que Faire à Paris, un agenda participarif des
      bons plans de la capitale.
    </p>
  </div>

  <p slot="license">
    <a
      href="https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/information/"
      target="_blank"
      noreferrer
      noopener>
      Que Faire à Paris ? - Evènements et activités, sous license OdbL
    </a>
  </p>
</Info>

<div class="flex flex-row aspect-ratio--object">
  <Controls />
  <Map />
</div>
