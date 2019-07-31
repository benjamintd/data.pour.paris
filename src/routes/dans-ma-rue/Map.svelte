<script>
  import { onMount } from "svelte";
  import { renderedFeatures, filters, categories } from "./stores.js";
  import Popup from "./Popup.svelte";

  let mapboxgl;
  let container;
  let map;
  let mapFilter;

  onMount(async () => {
    mapboxgl = (await import("mapbox-gl")).default;
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjaW83enIwNjYwMnB1dmlsejN6cDBzbm93In0.0ZOGwSLp8OjW6vCaEKYFng";

    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/benjamintd/cjxw3g8lv1k301dmsk77aepdk",
      center: [2.3387, 48.8597],
      zoom: 11
    });

    let popupContent = document.createElement("div");

    map.on("load", () => {
      map.on("click", e => {
        if (map.getZoom() < 15) return;
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
        if (map.getZoom() >= 15) {
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
      if ($filters.length > 0) {
        let f;
        if ($filters.length === 1 && $filters[0] === "Autres") {
          f = [
            "all",
            ...Object.keys(categories).map(c => ["!=", ["get", "type"], c])
          ];
        } else {
          f = ["any", ...$filters.map(c => ["==", ["get", "type"], c])];
        }
        map.setFilter("dansmarue-points", f);
        map.setFilter("dansmarue-heatmap", f);
        mapFilter = f;
      } else {
        map.setFilter("dansmarue-points", null);
        map.setFilter("dansmarue-heatmap", null);
        mapFilter = null;
      }
      setTimeout(() => setRenderedFeatures(), 300);
    }
  }

  async function setRenderedFeatures() {
    await waitForMap();
    const features = map.queryRenderedFeatures({
      layers: ["dansmarue-points"],
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
