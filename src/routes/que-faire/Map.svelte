<script>
  import { onMount } from "svelte";
  import {
    featureCollection,
    selectedFeature,
    activeFilter,
    filterFeatures,
  } from "./stores.js";

  let mapboxgl;
  let container;
  let map;

  $: {
    if (map && map.getSource("events")) {
      map.getSource("events").setData($featureCollection);
    }
  }

  $: {
    if (map && map.getSource("selected")) {
      if ($selectedFeature !== -1) {
        const f = $featureCollection.features.find(
          (f) => f.properties.id === $selectedFeature
        );
        if (f) {
          map.setFeatureState({ id: f.id, source: "events" }, { seen: true });
          map.getSource("selected").setData(f);
        }
      } else {
        map
          .getSource("selected")
          .setData({ type: "FeatureCollection", features: [] });
      }
    }
  }

  $: {
    if (map && map.getSource("events")) {
      map
        .getSource("events")
        .setData(filterFeatures($featureCollection, $activeFilter));
    }
  }

  // @todo add $: {} that filters the data depending on filters in store

  onMount(async () => {
    // We load it client-side to avoid server-side-rendering issues with Mapbox that needs a browser context
    mapboxgl = (await import("mapbox-gl")).default;
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjbG4xaDI3ZnAwMG1yMmtwZm1tejhxeTdrIn0.2QEK7gosDnyJ2yaBMczX4w";

    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/benjamintd/cjue3ir3w0dwy1fnzajaxngt5", // ben-maps
      center: [2.3387, 48.8597],
      zoom: 11,
    });
    window.map = map;

    map.on("load", async () => {
      // @todo write an api route that calls open data and caches the results (providing a featurecollection straight ahead)
      fetch("/api/que-faire/events")
        .then((res) => res.json())
        .then((fc) => {
          featureCollection.set(fc);
        });

      map.addSource("events", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addSource("selected", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer(
        {
          id: "events",
          type: "circle",
          source: "events",
          paint: {
            "circle-color": [
              "case",
              ["to-boolean", ["feature-state", "seen"]],
              "#c4d9f5",
              "#357edd",
            ],
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              14,
              3,
              17,
              10,
            ],
            "circle-stroke-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              14,
              1,
              17,
              3,
            ],
            "circle-stroke-color": "#000000",
          },
        },
        "waterway-label"
      );
      map.addLayer({
        id: "selected",
        type: "symbol",
        source: "selected",
        layout: {
          "icon-image": "pin",
          "icon-anchor": "bottom",
        },
      });

      map.on("click", function (e) {
        var bbox = [
          [e.point.x - 2, e.point.y - 2],
          [e.point.x + 2, e.point.y + 2],
        ];
        var features = map.queryRenderedFeatures(bbox, {
          layers: ["events"],
        });

        if (features.length) {
          selectedFeature.set(features[0].properties.id);
        } else {
          selectedFeature.set(-1);
        }
      });

      // Change the cursor to a pointer when the mouse is over the states layer.
      map.on("mouseenter", "events", function () {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.on("mouseleave", "events", function () {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      map.remove();
    };
  });
</script>

<div
  class="map z-1 h-100 flex-grow-1 absolute w-100 relative-l w-auto-l"
  bind:this={container}
/>
