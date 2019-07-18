<script>
  import HomeLink from "../../components/HomeLink.svelte";
  import Info from "../../components/Info.svelte";
  import Map from "./Map.svelte";
  import Controls from "./Controls.svelte";
</script>

<div class="flex flex-column aspect-ratio--object">
  <Map />
  <Controls />
</div>

<HomeLink />
<Info>
  <h1>dans ma rue</h1>
  <p>
    L'ensemble des anomalies signalées dans l'application Dans Ma Rue entre son
    lancement en 2012 et janvier 2019.
  </p>
  <p>
    Une fois zoomé, vous pouvez cliquer sur les plaintes individuelles pour voir
    leurs propriétés.
  </p>
  <p slot="license">
    <a
      href="https://opendata.paris.fr/explore/dataset/dans-ma-rue/"
      target="_blank"
      noreferrer
      noopener>
      Dans Ma Rue - Mairie de Paris, juillet 2019, sous license OdbL
    </a>
  </p>
</Info>
