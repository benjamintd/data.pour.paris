<script>
  import { onMount } from "svelte";
  import { currentTimestamp, referentiel, playing } from "./stores.js";
  import Play from "./Play.svelte";

  // they'll be defined client-side because d3 needs the `document`.
  let d3, line;

  onMount(async () => {
    console.log(await import("d3"));
    d3 = await import("d3");

    // the line generator
    line = d3
      .line()
      .x((d, i) => x(i)) // set the x values for the line generator
      .y(d => y(d)) // set the y values for the line generator
      .curve(d3.curveMonotoneX); // apply smoothing to the line
  });

  let startDate = new Date("2019-06-01T00:00:00+02:00");
  let startTimestamp = 0;
  let endTimestamp = 720; // todo we hardcode it but could derive from the data

  $: volumes = $referentiel.features.length
    ? $referentiel.features.reduce((a, b) => {
        if (b.properties.q) {
          return b.properties.q.map((e, i) => e + a[i] || 0);
        } else {
          return a;
        }
      }, [])
    : [];

  let graphWidth;
  let graphHeight;

  let x = () => 0; // scale x
  let y = () => 0; // scale y

  const handleMouseMove = e => {
    playing.set(false);
    currentTimestamp.set(Math.round(x.invert(e.offsetX)));
  };

  // redraw the gaph anytime `volumes` changes
  $: {
    if (d3) {
      let margin = 3;
      x = d3
        .scaleLinear()
        .domain([0, volumes.length - 1])
        .range([margin, graphWidth - margin]);

      y = d3
        .scaleLinear()
        .domain([0, d3.max(volumes)])
        .range([graphHeight - margin, margin]);

      d3.select("#controls-graph")
        .select("svg")
        .select("path")
        .data([volumes])
        .attr("d", line)
        .attr("stroke", "#000")
        .attr("fill", "none");
    }
  }
</script>

<style>
  .controls {
    height: 30vh;
  }

  .thinline {
    width: 1px;
    background-color: black;
  }
</style>

<div class="controls w-100 pa1 flex items-stretch">
  <Play />
  <div id="controls-graph" class="flex-grow-1 relative h-100">
    <div
      class="absolute flex flex-column h-100 tc"
      style="left: {x($currentTimestamp)}px;">
      <div class="thinline flex-grow-1" />
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
    </div>
    <div
      class="h-100 w-100"
      bind:offsetWidth={graphWidth}
      bind:offsetHeight={graphHeight}
      on:mousemove={handleMouseMove}>
      <svg width="100%" height="100%">
        <path />
      </svg>
    </div>
  </div>
</div>
