<script>
  import { onMount } from "svelte";
  import {
    renderedFeatures,
    filters,
    categories,
    dateSelection
  } from "./stores.js";
  import Popup from "./Popup.svelte";

  let mapboxgl;
  let container;
  let map;
  let mapFilter;

  onMount(async () => {
    mapboxgl = (await import("mapbox-gl")).default;
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjbG4xaDI3ZnAwMG1yMmtwZm1tejhxeTdrIn0.2QEK7gosDnyJ2yaBMczX4w";

    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/benjamintd/cjxw3g8lv1k301dmsk77aepdk",
      center: [2.3387, 48.8597],
      zoom: 11
    });

    let popupContent = document.createElement("div");

    map.on("load", () => {
      map.on("click", e => {
        if (map.getZoom() < 13.5) return;
        var bbox = [
          [e.point.x - 2, e.point.y - 2],
          [e.point.x + 2, e.point.y + 2]
        ];
        var features = map.queryRenderedFeatures(bbox, {
          layers: ["dansmarue-points"]
        });

        if (features.length) {
          var coordinates = features[0].geometry.coordinates.slice();
          new mapboxgl.Popup({ maxWidth: "300px" })
            .setDOMContent(popupContent)
            .setLngLat(coordinates)
            .addTo(map);

          const popup = new Popup({
            target: popupContent,
            props: {
              props: features[0].properties
            },
            hydrate: true
          });
        }
      });

      // Change the cursor to a pointer when the mouse is over the states layer.
      map.on("mouseenter", "dansmarue-points", function() {
        if (map.getZoom() >= 13.5) {
          map.getCanvas().style.cursor = "pointer";
        }
      });

      // Change it back to a pointer when it leaves.
      map.on("mouseleave", "dansmarue-points", function() {
        map.getCanvas().style.cursor = "";
      });

      map.on("moveend", () => setRenderedFeatures());
      setRenderedFeatures();
    });
  });

  $: {
    if (map && map.isStyleLoaded()) {
      let f = ["all", true];

      // Add type filters that are common for the graph (ghost layer) and the map
      if ($filters.length === 1 && $filters[0] === "Autres") {
        f.push([
          "all",
          ...Object.keys(categories).map(c => ["!=", ["get", "type"], c])
        ]);
      } else if ($filters.length > 0) {
        f.push(["any", ...$filters.map(c => ["==", ["get", "type"], c])]);
      }

      mapFilter = [...f];
      map.setFilter("dansmarue-points-ghost", mapFilter);

      // add the date selection filters that are only for the visible layers
      if ($dateSelection.length) {
        f.push([
          "all",
          [
            ">=",
            ["get", "datedecl"],
            new Date($dateSelection[0]).toISOString().split("T")[0]
          ],
          [
            "<=",
            ["get", "datedecl"],
            new Date($dateSelection[1]).toISOString().split("T")[0]
          ]
        ]);
      }

      map.setFilter("dansmarue-points", f);
      map.setFilter("dansmarue-heatmap", f);

      setTimeout(() => setRenderedFeatures(), 150);
    }
  }

  async function setRenderedFeatures() {
    await waitForMap();
    const features = map.queryRenderedFeatures({
      layers: ["dansmarue-points-ghost"],
      filter: mapFilter
    });
    renderedFeatures.set(features);
  }

  function waitForMap() {
    if (map && map.isStyleLoaded()) {
      return Promise.resolve();
    } else {
      return new Promise((resolve, reject) => {
        map.once("idle", () => resolve());
      });
    }
  }
</script>

<div class="map z-1 w-100 h-100" bind:this={container} />
