<script>
  import { onMount, setContext } from "svelte";
  import { currentTimestamp, referentiel } from "./stores.js";

  let mapboxgl;

  let container;
  let map;

  onMount(async () => {
    mapboxgl = (await import("mapbox-gl")).default;
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjaW83enIwNjYwMnB1dmlsejN6cDBzbm93In0.0ZOGwSLp8OjW6vCaEKYFng";

    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/mapbox/light-v9",
      center: [2.3387, 48.8597],
      zoom: 11
    });
    window.map = map;

    map.on("load", async () => {
      const fc = await fetch("/trafic.geojson")
        .then(res => res.json())
        .then(fc => {
          // set ids for each feature
          fc.features.forEach((f, i) => {
            f.id = i;
          });
          referentiel.set(fc);
        });

      map.addSource("referentiel", { type: "geojson", data: $referentiel });
      map.addLayer(
        {
          id: "referentiel",
          type: "line",
          source: "referentiel",
          paint: {
            "line-width": [
              "max",
              ["/", ["coalesce", ["feature-state", "q"], 1], 500],
              1
            ],
            "line-color": [
              "interpolate",
              ["linear"],
              ["coalesce", ["feature-state", "k"], 0],
              0,
              "hsla(60, 89%, 55%, 0.63)",
              5,
              "#fa9b3b",
              15,
              "#de5f63",
              40,
              "#9410a0",
              60,
              "#110787"
            ]
          }
        },
        "waterway-label"
      );
    });

    return () => {
      map.remove();
    };
  });

  $: {
    $currentTimestamp;
    if (map && map.isStyleLoaded() && map.getSource("referentiel")) {
      $referentiel.features.forEach(f => {
        map.setFeatureState(
          { id: f.id, source: "referentiel" },
          {
            q: f.properties.q ? f.properties.q[$currentTimestamp] : 0,
            k: f.properties.k ? f.properties.k[$currentTimestamp] : 0
          }
        );
      });
    }
  }
</script>

<style>
  .map {
    width: 100%;
    height: 70vh;
  }
</style>

<div class="map z-1" bind:this={container} />
