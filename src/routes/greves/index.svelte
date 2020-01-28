<script>
  import Map from "./Map.svelte";
  import Play from "./Play.svelte";
  import Date from './Date.svelte';
  import Spinner from '../../components/Spinner.svelte';
  import Info from '../../components/Info.svelte';
  import HomeLink from '../../components/HomeLink.svelte';
  import { featureCollection } from "./stores.js";
</script>

{#if $featureCollection.features.length === 0}
  <Spinner />
{:else}
  <HomeLink />
{/if}

<Info title="Trafic cycliste pendant les grèves" link="trafic">
  <p slot="gist">
    Voici une visualisation du trafic cycliste pendant les grèves de la RATP et SNCF dans Paris.
  </p>
  <div slot="details">
    <p>
      Les données proviennent des compteurs installés dans la ville.
    </p>
  </div>

  <p slot="license">
    <a
      href="https://opendata.paris.fr/explore/dataset/comptages-routiers-permanents/information/"
      target="_blank"
      noreferrer
      noopener>
      Comptage routier - Mairie de Paris, juin 2019, sous license OdbL
    </a>
  </p>
</Info>

<div class="flex flex-column aspect-ratio--object">
  <Date/>
  <Map />
  <Play/>
</div>
