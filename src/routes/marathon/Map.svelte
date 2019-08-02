<script>
  import { onMount } from "svelte";
  import { featureCollection, time } from "./stores.js";

  let mapboxgl;
  let container;
  let map;

  $: strippedGeoJSON = {
    type: "FeatureCollection",
    features: $featureCollection.features.map((f, id) => ({
      id,
      type: f.type,
      geometry: f.geometry,
      properties: {
        density: 0
      }
    }))
  };

  $: {
    if (map && map.isStyleLoaded()) {
      for (let id = 0; id < $featureCollection.features.length; id++) {
        map.setFeatureState(
          { id, source: "runners" },
          {
            density: $featureCollection.features[id].properties.densities[$time]
          }
        );
      }
    }
  }

  onMount(async () => {
    // We load it client-side to avoid server-side-rendering issues with Mapbox that needs a browser context
    mapboxgl = (await import("mapbox-gl")).default;
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjaW83enIwNjYwMnB1dmlsejN6cDBzbm93In0.0ZOGwSLp8OjW6vCaEKYFng";

    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/mapbox/light-v9",
      center: [2.343, 48.858],
      zoom: 11,
      interactive: false
    });
    window.map = map;

    map.on("load", async () => {
      map.fitBounds([
        [2.197408, 48.806339], // Southwest coordinates
        [2.472066, 48.910929] // Northeast coordinates
      ]);
      map.addSource("runners", { type: "geojson", data: strippedGeoJSON });

      const fc = await fetch("/api/marathon/fc.json")
        .then(res => res.json())
        .then(fc => featureCollection.set(fc));

      map.getSource("runners").setData(strippedGeoJSON);

      map.addLayer(
        {
          id: "points",
          type: "heatmap",
          source: "runners",
          paint: {
            "heatmap-weight": ["coalesce", ["feature-state", "density"], 0],
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              12,
              0.007,
              17,
              0.004
            ],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(33,102,172,0.0)",
              0.2,
              "rgb(103,169,207)",
              0.4,
              "rgb(209,229,240)",
              0.6,
              "rgb(240, 196, 131)",
              0.8,
              "rgb(239,138,98)",
              1,
              "rgb(178,24,43)"
            ],
            // Adjust the heatmap radius by zoom level
            "heatmap-radius": 11,
            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              1,
              16,
              0.2
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
</script>

<div class="map z-1 w-100 flex-grow-1" bind:this={container} />
