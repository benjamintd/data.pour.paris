<script>
  import { onMount } from "svelte";
  import {
    currentTimestamp,
    featureCollection,
    selectedFeature,
    playing
  } from "./stores.js";
  import Play from "./Play.svelte";

  // they'll be defined client-side because d3 needs the `document`.
  let d3, line;

  onMount(async () => {
    d3 = await import("d3");
  });

  let startDate = new Date("2019-06-01T00:00:00+02:00");
  let startTimestamp = 0;
  let endTimestamp = 720; // todo we hardcode it but could derive from the data

  const reducer = (a, b) => {
    // we end up with an array of {q, k, n}, one per timestamp aggregated for all features.
    if (b.properties.q && b.properties.q.length === endTimestamp) {
      b.properties.q.forEach((e, i) => {
        if (a[i] && a[i].q) a[i].q += e;
        else a[i] = { ...a[i], q: e };
      });
    }

    if (b.properties.k && b.properties.k.length === endTimestamp) {
      b.properties.k.forEach((e, i) => {
        if (a[i] && a[i].k && a[i].n) {
          a[i].k += e;
          a[i].n += 1;
        } else a[i] = { ...a[i], k: e, n: 1 };
      });
    }
    return a;
  };

  $: collectionVolumes = $featureCollection.features.length
    ? $featureCollection.features.reduce(reducer, [])
    : [];

  $: selectedVolumes = $featureCollection.features[$selectedFeature]
    ? reducer([], $featureCollection.features[$selectedFeature])
    : [];

  let graphWidth;
  let graphHeight;

  let x = () => 0; // scale x
  let y = () => 0; // scale y
  let selectedY = () => 0; // scale y for selected feature

  const handleMouseMove = e => {
    playing.set(false);
    currentTimestamp.set(Math.round(x.invert(e.offsetX)));
  };

  // redraw the graph anytime `collectionVolumes` or `selectedVolumes` changes
  $: {
    if (d3) {
      let margin = 3;

      // remove existing gradients and lines
      d3.select("#controls-graph")
        .selectAll("svg")
        .remove();

      // chose whether we display the selected graph or the overall one.
      let volumes;
      if (selectedVolumes.length) {
        volumes = selectedVolumes;
      } else {
        volumes = collectionVolumes;
      }

      // define the scales
      x = d3
        .scaleLinear()
        .domain([0, collectionVolumes.length - 1])
        .range([margin, graphWidth - margin]);

      y = d3
        .scaleLinear()
        .domain([0, d3.max(volumes.map(d => d.q))])
        .range([graphHeight - margin, margin]);

      let colorScale = d3
        .scaleLinear()
        .domain([0, 5, 15, 35, 60]) // the same scale as the one used in the mapbox style
        .range([
          "hsl(60, 89%, 55%)",
          "#fa9b3b",
          "#de5f63",
          "#9410a0",
          "#110787"
        ]);

      // define gradient
      d3.select("#controls-graph")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("defs")
        .append("linearGradient")
        .attr("id", "volumesGradient")
        .selectAll("stop")
        .data(volumes)
        .enter()
        .append("stop")
        .attr("offset", (d, i) => i / volumes.length)
        .attr("stop-color", d => colorScale(d.k / (d.n || 1)));

      // the line generator
      line = d3
        .line()
        .x((d, i) => x(i))
        .y((d, i, data) => {
          if (d.q) {
            return y(d.q);
          } else if (data[i - 1] && data[i + 1]) {
            return y((data[i - 1].q + data[i + 1].q) / 2);
          } else return 0;
        }) // if 0, average the neighboring values
        .curve(d3.curveMonotoneX); // apply smoothing to the line

      // draw line
      d3.select("#controls-graph")
        .select("svg")
        .append("path")
        .data([volumes])
        .attr("d", line)
        .attr("stroke", "url(#volumesGradient)")
        .attr("stroke-width", 1.5)
        .attr("fill", "none");
    }
  }
</script>

<style>
  .thinline {
    width: 1px;
    background-color: black;
  }
</style>

<div class="h6 w-100 pa1 flex items-stretch">
  <Play />
  <div class="relative flex-grow-1 flex flex-column relative h-100">
    <div
      class="flex-grow-1 w-100 relative"
      id="controls-graph"
      bind:offsetWidth={graphWidth}
      bind:offsetHeight={graphHeight}>
      <div
        class="absolute thinline h-100"
        style="left: {x($currentTimestamp)}px;" />
      <div
        class="absolute w-100 h-100"
        on:mousemove={e => handleMouseMove(e)} />
    </div>
    <div class="relative h2">
      <div
        class="absolute"
        style="left: {Math.min(x($currentTimestamp), graphWidth - 150)}px;">
        {$currentTimestamp !== undefined ? new Date(startDate.getTime() + 1000 * 60 * 60 * $currentTimestamp - 30 * 60 * 1000).toLocaleString(
              'fr-FR',
              {
                timeZone: 'Europe/Paris',
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }
            ) : ''}
        <br />
        {#if selectedVolumes[$currentTimestamp]}
          <span class="black-50 fw2">
            {selectedVolumes[$currentTimestamp].q} véhicules / h
          </span>
        {/if}
      </div>
    </div>
  </div>
</div>
