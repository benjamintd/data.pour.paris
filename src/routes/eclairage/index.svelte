<script>
  import { onMount } from "svelte";
  import Info from "../../components/Info.svelte";
  import HomeLink from "../../components/HomeLink.svelte";

  let mapboxgl;
  let container;
  let map;

  onMount(async () => {
    mapboxgl = (await import("mapbox-gl")).default;
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjaW83enIwNjYwMnB1dmlsejN6cDBzbm93In0.0ZOGwSLp8OjW6vCaEKYFng";

    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/benjamintd/cjy0qetj804t51cmkdhmjjuum",
      center: [2.3387, 48.8597],
      zoom: 11
    });
  });
</script>

<div class="aspect-ratio--object" bind:this={container} />
<HomeLink />
<Info>
  <h1>éclairage public</h1>
  <p>L'ensemble de l'éclairage public hors souterrains.</p>
  <p slot="license">
    <a
      href="https://opendata.paris.fr/explore/dataset/eclairage-public"
      target="_blank"
      noreferrer
      noopener>
      Éclairage public - Mairie de Paris, juillet 2019, sous license OdbL
    </a>
  </p>
</Info>
