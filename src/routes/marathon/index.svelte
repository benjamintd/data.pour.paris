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
    Visualisez la trace des 41,700 finishers du Marathon de Paris 2018, ainsi
    que la densité de coureurs au long du parcours au fil du temps.
  </p>
  <p>
    Le graphe représente les 42,125km du parcours en abscisse, la densité de
    coureurs en ordonnée, et la vitesse moyenne à chaque instant en couleur (du
    jaune, 8km/h, au violet, 18km/h).
  </p>
  <p>Vous pouvez changer la vitesse de l'animation grâce au slider.</p>
  <p slot="license">
    Données anonymisées et aggrégées depuis l'API de RTRT (Reat-Time Race
    Tracking), partenaire du Schneider Electric Marathon de Paris 2018.
    <br />
    Icônes:
    <a href="https://www.flaticon.com/authors/monkik" title="monkik">monkik</a>
    <a
      href="http://creativecommons.org/licenses/by/3.0/"
      title="Creative Commons BY 3.0"
      target="_blank">
      CC 3.0 BY
    </a>
  </p>
</Info>

<div class="flex flex-column aspect-ratio--object">
  <Map />
  <Controls />
</div>
