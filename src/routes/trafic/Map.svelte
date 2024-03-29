<script>
  import { onMount } from "svelte";
  import {
    currentTimestamp,
    featureCollection,
    selectedFeature
  } from "./stores.js";

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

  onMount(async () => {
    // We load it client-side to avoid server-side-rendering issues with Mapbox that needs a browser context
    mapboxgl = (await import("mapbox-gl")).default;
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjbG4xaDI3ZnAwMG1yMmtwZm1tejhxeTdrIn0.2QEK7gosDnyJ2yaBMczX4w";

    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/benjamintd/cjy0ok49i032v1cl0c23uvd5y", // light-v9 with french labels
      center: [2.3387, 48.8597],
      zoom: 11
    });
    window.map = map;

    map.on("load", async () => {
      const fc = await fetch("/api/trafic/june.json")
        .then(res => res.json())
        .then(fc => {
          // set ids for each feature
          fc.features.forEach((f, i) => {
            f.id = i;
          });
          featureCollection.set(fc);
        });

      map.addSource("collection", { type: "geojson", data: strippedGeoJSON });
      map.addLayer(
        {
          id: "collection",
          type: "line",
          source: "collection",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-width": [
              "max",
              ["/", ["coalesce", ["feature-state", "q"], 1], 500],
              1
            ],
            "line-offset": [
              "case",
              ["coalesce", ["feature-state", "selected"], false],
              2,
              0
            ],
            "line-offset-transition": {
              duration: 500
            },
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
              35,
              "#9410a0",
              60,
              "#110787"
            ]
          }
        },
        "waterway-label"
      );

      map.addLayer(
        {
          id: "collection-halo",
          type: "line",
          source: "collection",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-width": [
              "+",
              5,
              ["max", ["/", ["coalesce", ["feature-state", "q"], 1], 500], 1]
            ],
            "line-opacity": [
              "case",
              ["coalesce", ["feature-state", "selected"], false],
              0.5,
              0
            ],
            "line-blur": 3,
            "line-color": "#444"
          }
        },
        "collection"
      );
    });

    map.on("click", function(e) {
      var bbox = [
        [e.point.x - 2, e.point.y - 2],
        [e.point.x + 2, e.point.y + 2]
      ];
      var features = map.queryRenderedFeatures(bbox, {
        layers: ["collection"]
      });

      // remove feature state from previously selected feature
      if ($selectedFeature > -1) {
        map.removeFeatureState(
          { id: $selectedFeature, source: "collection" },
          "selected"
        );
      }

      if (features.length) {
        const id = features[0].id;
        map.setFeatureState({ id, source: "collection" }, { selected: true });
        selectedFeature.set(features[0].id);
      } else {
        selectedFeature.set(-1);
      }
    });

    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on("mouseenter", "collection", function() {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "collection", function() {
      map.getCanvas().style.cursor = "";
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
            q: f.properties.q ? f.properties.q[$currentTimestamp] : 0,
            k: f.properties.k ? f.properties.k[$currentTimestamp] : 0
          }
        );
      });
    }
  }
</script>

<div class="map z-1 w-100 flex-grow-1" bind:this={container} />
