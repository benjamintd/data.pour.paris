<script>
  import { onMount } from "svelte";
  import Info from "../../components/Info.svelte";
  import HomeLink from "../../components/HomeLink.svelte";
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
      style: "mapbox://styles/benjamintd/cjy0qetj804t51cmkdhmjjuum",
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
          layers: ["eclairagepublic-points"]
        });

        if (features.length) {
          var coordinates = features[0].geometry.coordinates.slice();
          new mapboxgl.Popup()
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
      map.on("mouseenter", "eclairagepublic-points", function() {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.on("mouseleave", "eclairagepublic-points", function() {
        map.getCanvas().style.cursor = "";
      });
    });
  });
</script>

<div class="aspect-ratio--object" bind:this={container} />
<HomeLink />
<Info title="Éclairage public" link="eclairage">
  <p slot="gist">L'ensemble de l'éclairage public hors souterrains de Paris.</p>
  <div slot="details">
    <p>
      Une fois zoomé, vous pouvez cliquer sur les lampes individuelles pour voir
      leurs propriétés (puissance, chaleur, etc.)
    </p>
  </div>
  <p slot="license">
    <a
      href="https://opendata.paris.fr/explore/dataset/eclairage-public"
      target="_blank"
      noreferrer
      noopener>
      Éclairage public - Mairie de Paris, juillet 2019, sous license OdbL
    </a>
  </p>
</Info>
