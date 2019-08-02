<script>
  import HomeLink from "../../components/HomeLink.svelte";
  import Info from "../../components/Info.svelte";
  import Map from "./Map.svelte";
  import Controls from "./Controls.svelte";
</script>

<div class="aspect-ratio--object">
  <div class="relative w-100 h-100">
    <Map />
    <Controls />
  </div>
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
    leur catégorie, date, et adresse.
  </p>
  <p>
    Le graphe décrit l'évolution du nombre de signalements dans le temps ; on
    remarque que l'application est devenue très populaire au cours de l'année
    2018. Vous pouvez filtrer la carte de manière temporelle en sélectionnant
    une plage de temps. Il est aussi possible de filtrer par catégorie. en
    cliquant sur la légende.
  </p>
  <p>
    Notez qu'il est possible que des changements dans l'application, son
    marketing, la répartition géographique et démographique de ses utilisateurs,
    biaisent les données que vous voyez à l'écran. Il est difficile d'en tirer
    des conclusions quant à la propreté relative des arrondissements, par
    exemple. Néanmoins, visualiser cette donnée brute permet de voir l'activité
    de la ville d'une autre manière.
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
