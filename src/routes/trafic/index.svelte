<script>
  import Map from "./Map.svelte";
  import Controls from "./Controls.svelte";
  import Spinner from "../../components/Spinner.svelte";
  import HomeLink from "../../components/HomeLink.svelte";
  import Info from "../../components/Info.svelte";
  import { referentiel } from "./stores.js";
</script>

{#if $referentiel.features.length === 0}
  <Spinner />
{:else}
  <HomeLink />
{/if}

<Info>
  <h1>trafic</h1>
  <p>
    Voici une visualisation du trafic de juin 2019 tel que mesuré par les
    capteurs permanents posés à Paris. Jouez le trafic en appuyant sur
    <kbd>►</kbd>
    ou glissez votre souris sur le bandeau temporel.
  </p>
  <p>
    Certaines heures ne disposent pas de données pour quelques - ou l'ensemble -
    des routes. Pour cette raison le graphe de densité possède quelques creux
    dont il ne faut pas tenir compte.
  </p>
  <p>
    L'épaisseur des segments correspond au compte de voitures passées dans
    l'heure, tandis que la couleur correspond à la densité du trafic. Un trait
    de faible épaisseur et complètement bleu foncé représente par exemple un
    bouchon à l'arrêt, tandis qu'un trait épais et jaune pourrait correspondre à
    une situation de périphérique fluide.
  </p>
  <p>
    Le choix d'une échelle de couleur différente du traditionnel vert - orange -
    rouge permet d'avoir une échelle perceptuellement uniforme et de
    s'affranchir des biais associés aux couleurs que l'on voit habituellement.
  </p>
  <p>
    Le mois de juin est intéressant car il comporte un jour férié - le lundi de
    pentecôte le 10 - et la fête de la musique le 21.
  </p>
  <p>
    Plus d'informations sur les données utilisées sur le
    <a
      href="https://opendata.paris.fr/explore/dataset/comptages-routiers-permanents/information/"
      target="_blank"
      noreferrer
      noopener>
      site opendata.paris
    </a>
    ou sur la
    <a
      href="https://opendata.paris.fr/api/datasets/1.0/comptages-routiers-permanents/attachments/notice_donnes_trafic_capteurs_permanents_version_20190607_pdf/"
      noreferrer
      noopener>
      documentation PDF.
    </a>
  </p>
</Info>

<Map />
<Controls />
