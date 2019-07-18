<script>
  import { onMount } from "svelte";
  import Popup from "./Popup.svelte";

  let mapboxgl;
  let container;
  let map;

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
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.on("mouseleave", "dansmarue-points", function() {
        map.getCanvas().style.cursor = "";
      });
    });
  });
</script>

<div class="map z-1 w-100 flex-grow-1" bind:this={container} />
