<script>
  import { onMount } from "svelte";
  import { featureCollection, selectedFeature } from "./stores.js";

  let mapboxgl;
  let container;
  let map;

  $: {
    if (map && map.getSource("events")) {
      map.getSource("events").setData($featureCollection);
    }
  }

  onMount(async () => {
    // We load it client-side to avoid server-side-rendering issues with Mapbox that needs a browser context
    mapboxgl = (await import("mapbox-gl")).default;
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjaW83enIwNjYwMnB1dmlsejN6cDBzbm93In0.0ZOGwSLp8OjW6vCaEKYFng";

    map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/benjamintd/cjue3ir3w0dwy1fnzajaxngt5", // ben-maps
      center: [2.3387, 48.8597],
      zoom: 11
    });
    window.map = map;

    map.on("load", async () => {
      // @todo write an api route that calls open data and caches the results (providing a featurecollection straight ahead)
      fetch(
        "https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&rows=10&facet=category&facet=tags&facet=address_zipcode&facet=address_city&facet=pmr&facet=blind&facet=deaf&facet=access_type&facet=price_type"
      )
        .then(res => res.json())
        .then(res => {
          const features = res.records.map((r, i) => ({
            type: "Feature",
            id: i,
            properties: { ...r.fields },
            geometry: r.geometry
          }));

          featureCollection.set({ type: "FeatureCollection", features });
        });

      map.addSource("events", { type: "geojson", data: $featureCollection });
      map.addLayer(
        {
          id: "events",
          type: "circle",
          source: "events",
          paint: {}
        },
        "waterway-label"
      );

      map.on("click", function(e) {
        var bbox = [
          [e.point.x - 2, e.point.y - 2],
          [e.point.x + 2, e.point.y + 2]
        ];
        var features = map.queryRenderedFeatures(bbox, {
          layers: ["events"]
        });

        // remove feature state from previously selected feature
        if ($selectedFeature > -1) {
          map.removeFeatureState(
            { id: $selectedFeature, source: "events" },
            "selected"
          );
        }

        if (features.length) {
          const id = features[0].id;
          map.setFeatureState({ id, source: "events" }, { selected: true });
          selectedFeature.set(features[0].id);
        } else {
          selectedFeature.set(-1);
        }
      });

      // Change the cursor to a pointer when the mouse is over the states layer.
      map.on("mouseenter", "events", function() {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.on("mouseleave", "events", function() {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      map.remove();
    };
  });
</script>

<div class="map z-1 h-100 flex-grow-1" bind:this={container} />
