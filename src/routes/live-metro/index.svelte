<script>
  import cheapRuler from "cheap-ruler";
  import { onMount } from "svelte";
  import { quadInOut } from "svelte/easing";
  import getMetroImage from "./getMetroImage.js";
  import positionsFromSplits from "./positionsFromSplits.js";
  import Info from "../../components/Info.svelte";
  import HomeLink from "../../components/HomeLink.svelte";
  import Spinner from "../../components/Spinner.svelte";

  let mapboxgl;
  let container;
  let map;

  let loading = true;

  const ruler = cheapRuler(48.86727, "meters");

  onMount(async () => {
    mapboxgl = (await import("mapbox-gl")).default;
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjaW83enIwNjYwMnB1dmlsejN6cDBzbm93In0.0ZOGwSLp8OjW6vCaEKYFng";

    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/benjamintd/cjnvml1se1kz02rluirxwimvj",
      center: [2.3387, 48.8597],
      zoom: 11
    });

    map.on("load", () => {
      map.addSource("trains", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });

      map.addLayer({
        id: "trains-bearing",
        type: "symbol",
        source: "trains",
        layout: {
          "icon-rotate": ["get", "b"],
          "icon-image": ["coalesce", ["get", "c"], "#aaa"], // the image is just noted by the (hex) color
          "icon-anchor": "center",
          "icon-allow-overlap": true,
          "icon-size": {
            base: 1,
            stops: [[10, 0.5], [12, 1]]
          }
        }
      });

      map.on("styleimagemissing", async e => {
        // e.id contains the image id which is a color in hex
        const img = await getMetroImage(e.id);
        if (!map.hasImage(e.id)) {
          // there can be some race condition that lead to adding it twice
          map.addImage(e.id, img);
        }
      });

      fetchAndStart();
    });
  });

  async function fetchAndStart() {
    const easing = quadInOut;
    const splitsProm = fetch("/api/live-metro/get-train-splits").then(res =>
      res.json()
    );

    const linesHashProm = fetch("/api/live-metro/linesHash.json").then(res =>
      res.json()
    );
    // allows to run both queries concurrently
    const [splits, linesHash] = await Promise.all([splitsProm, linesHashProm]);
    loading = false;

    const fpsInterval = 1 / 10; // 10 FPS max
    let then = Date.now() / 1000;
    let now;

    function animate() {
      const currentLines = [];
      now = Date.now() / 1000; // in seconds
      const elapsed = now - then;

      // early return to restrict frame rate (and CPU load)
      if (elapsed < fpsInterval) return window.requestAnimationFrame(animate);
      // otherwise, reset 'then' and keep drawing
      then = now - (elapsed % fpsInterval);

      const featureCollection = positionsFromSplits(linesHash, splits, now);
      map.getSource("trains").setData(featureCollection);

      return window.requestAnimationFrame(animate);
    }

    animate();
  }
</script>

<div class="aspect-ratio--object" bind:this={container} />
{#if loading}
  <Spinner />
{:else}
  <HomeLink />
{/if}
<Info>
  <h1>carte des trains d'Île de France Mobilités</h1>
  <p>
    Voici une carte en direct des trains circulant sur le réseau d'Ile de
    France, grâce aux données en temps réel d'Île de France Mobilités.
  </p>
  <p>
    La donnée est la même que celle que l'on peut voir sur les quais du métro,
    ce qui signifie qu'un traitement est réalisé afin d'estimer leur position à
    tout moment. En particulier, nous effectuons un calcul de déduplication des
    trains et une estimation de leur vitesse sur le réseau.
  </p>
  <p>
    La page fait appel aux API d'Île de France Mobilités et peut être un peu
    longue à charger.
  </p>
  <p slot="license">
    <a
      href="https://opendata.stif.info/page/api-stif/"
      target="_blank"
      noreferrer
      noopener>
      API Temps Réel - Île de France Mobilités, sous licenses OdbL et Etalab
    </a>
  </p>
</Info>
