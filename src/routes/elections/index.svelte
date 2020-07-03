<script>
  import { onMount } from "svelte";
  import Info from "../../components/Info.svelte";
  import HomeLink from "../../components/HomeLink.svelte";
  import Legend from "./legend.svelte";

  let mapboxgl;
  let container;
  let map;

  onMount(async () => {
    mapboxgl = (await import("mapbox-gl")).default;
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjaW83enIwNjYwMnB1dmlsejN6cDBzbm93In0.0ZOGwSLp8OjW6vCaEKYFng";

    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/benjamintd/ckc66ro0i101k1iowkdqfv93w",
      center: [2.3387, 48.8597],
      zoom: 11
    });
  });
</script>

<div class="aspect-ratio--object" bind:this={container} />
<HomeLink />
<Info title="Élections municipales" link="elections">
  <p slot="gist">
    Les votes du second tour de l'élection municipale à Paris. Chaque point
    représente un vote.
  </p>
  <div slot="details">
    <p>
      Les votes sont répartis aléatoirement dans le bureau de vote associé, en
      excluant les parcs et les voies d'eau. La position des points ne doit donc
      pas être interprétée plus précisément qu'au niveau du bureau de vote. La
      couleur des points correspond à la liste associée au candidat pour la
      mairie d'arrondissement en question.
    </p>
    <p>
      Dans le 7ème arrondissement où Mme Rachida Dati a été élue au premier
      tour, la donnée utilisée est celle du premier tour.
    </p>
    <p>
      Pour que la carte reste lisible, les votes blancs et abstentions n'ont pas
      été représentés.
    </p>
  </div>
  <p slot="license">
    <a
      href="https://opendata.paris.fr/explore/dataset/elections-municipales-2020-2emetour/information/"
      target="_blank"
      noreferrer
      noopener>
      Elections - Municipales 2020 - 2ème Tour, juin 2020, sous license OdbL
    </a>
    <br />
    <a
      href="https://opendata.paris.fr/explore/dataset/secteurs-des-bureaux-de-vote/information/"
      target="_blank"
      noreferrer
      noopener>
      Secteurs des bureaux de vote, mars 2020, sous license OdbL
    </a>
    <br />
    <a
      href="https://opendata.paris.fr/explore/dataset/espaces_verts/information"
      target="_blank"
      noreferrer
      noopener>
      Espaces verts et assimilés, juillet 2020, sous license OdbL
    </a>
    <br />
    <a
      href="https://opendata.paris.fr/explore/dataset/plan-de-voirie-voies-deau/information"
      target="_blank"
      noreferrer
      noopener>
      Plan de voirie - voies d'eau, juin 2020, sous license OdbL
    </a>
  </p>
</Info>
<Legend />
