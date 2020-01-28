<script>
  import { onMount } from "svelte";
  import {
    currentTimestamp,
    featureCollection  } from "./stores.js";

  let mapboxgl;
  let container;
  let map;

  $: strippedGeoJSON = {
    type: "FeatureCollection",
    features: $featureCollection.features.map(f => ({
      id: f.id,
      type: f.type,
      geometry: f.geometry,
      properties: {} // don't include the data in the map features as a performance improvement
    }))

  };

  $: {
        console.log(strippedGeoJSON)
  }

  onMount(async () => {
    // We load it client-side to avoid server-side-rendering issues with Mapbox that needs a browser context
    mapboxgl = (await import("mapbox-gl")).default;
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjaW83enIwNjYwMnB1dmlsejN6cDBzbm93In0.0ZOGwSLp8OjW6vCaEKYFng";

    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/benjamintd/cjy0ok49i032v1cl0c23uvd5y", // light-v9 with french labels
      center: [2.3387, 48.8597],
      zoom: 11
    });
    window.map = map;

    map.on("load", async () => {
      const fc = await fetch("https://gist.githubusercontent.com/benjamintd/13fc2ee10e3624defa32c4088a603480/raw/1e4ce8e348c4f7722bd8e1968b07a290d1dd6913/velo.json")
        .then(res => res.json())
        .then(fc => {
          // set ids for each feature
          fc.features.forEach((f, i) => {
            f.id = i;
          });
          featureCollection.set(fc);
        });

      map.addSource("collection", { type: "geojson", data: strippedGeoJSON });


      map.addLayer({
        id: 'collection-heat',
        type: 'heatmap',
        source: 'collection',
        paint: {
          // increase weight as diameter breast height increases
          'heatmap-weight': ["feature-state", "count"],
          'heatmap-intensity': 0.005,
          // assign color values be applied to points depending on their density
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, "hsla(60, 89%, 55%, 0.0)",
            0.2, "#fa9b3b",
            0.4, "#de5f63",
            0.6, "#9410a0",
            0.8, "#110787"
          ],
          // increase radius as zoom increases
          'heatmap-radius': 50,
          // decrease opacity to transition into the circle layer
          'heatmap-opacity': 0.2,
        }
      }, 'waterway-label');

      map.addLayer(
        {
          id: "collection",
          type: "circle",
          source: "collection",
          paint: {
            "circle-radius": ["sqrt",["coalesce", ["feature-state", "count"], 1]],
            "circle-opacity": 0.5,
            "circle-color": [
              "interpolate",
              ["linear"],
              ["coalesce", ["feature-state", "count"], 0],
              0,
              "hsla(60, 89%, 55%, 0.63)",
              200,
              "#fa9b3b",
              400,
              "#de5f63",
              600,
              "#9410a0",
              1000,
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
    if (map && map.isStyleLoaded() && map.getSource("collection")) {
      $featureCollection.features.forEach(f => {
        map.setFeatureState(
          { id: f.id, source: "collection" },
          {
            count: f.properties.counts ? f.properties.counts[$currentTimestamp] : 0,
          }
        );
      });
    }
  }
</script>

<div class="map z-1 w-100 flex-grow-1" bind:this={container} />
