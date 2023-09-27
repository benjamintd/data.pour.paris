<script>
  import { onMount } from "svelte";
  import Info from "../../components/Info.svelte";

  let mapboxgl;
  let container;
  let map;

  onMount(async () => {
    mapboxgl = (await import("mapbox-gl")).default;

    const token =
      "pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjbG4xaDI3ZnAwMG1yMmtwZm1tejhxeTdrIn0.2QEK7gosDnyJ2yaBMczX4w";
    mapboxgl.accessToken = token;
    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/benjamintd/ckewzgieb18ix19l5m00p7r1t",
      center: [2.346517, 48.857704], // starting position [lng, lat]
      zoom: 11 // starting zoom
    });
    window.map = map;

    return () => {
      map.remove();
    };
  });
</script>

<style>
  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
</style>

<Info title="Carte des mobilités douces" link="mobilites-douces">
  <h1 slot="title">Carte des mobilités douces à Paris</h1>
  <p slot="gist">
    Cette carte de Paris montre les principaux axes vélo et les zones de
    circulation piétonne à Paris.
  </p>
  <div slot="details">
    <p>
      La plupart des cartes hiérarchisent les axes routiers, en montrant en
      priorité les axes rapides (donc peu accessibles aux piétons et vélos).
      L'idée de cette carte est d'expérimenter avec un style de carte qui
      privilégierait les axes vélos et les zones de circulation piétonne.
    </p>
    <p>
      En bleu, les zones d'intérêt piétons (présence de terrasses). En orange,
      les axes cyclables.
    </p>
    <p>
      Les données datent de l'été 2020, après l'ouverture des pistes cyclables
      temporaires.
    </p>
  </div>
  <p slot="license">
    <a href="https://opendata.paris.fr" target="_blank" noreferrer noopener>
      Plusieurs dataset d'Open Data Paris, 2020, sous license OdbL
    </a>
  </p>
</Info>
<div id="map" bind:this={container} />
