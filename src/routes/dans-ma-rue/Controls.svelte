<script>
  import { onMount } from "svelte";
  import {
    renderedFeatures,
    filters,
    categories,
    categoriesList
  } from "./stores.js";

  let d3;
  let graphWidth;
  let graphHeight;
  let proportionsSize;
  let margin = 30;
  // the d3 objects that we'll reuse (generators and scales)
  let stack;
  let area;
  let x, y;
  let svg;
  let path;

  $: counts = $renderedFeatures.reduce(
    (o, f) => {
      const date = new Date(f.properties.datedecl);
      const roundedDate =
        12 * (date.getFullYear() - 2012) + (date.getMonth() - 6);

      if (!o[roundedDate]) {
        return o;
      }

      if (o[roundedDate][f.properties.type] !== undefined) {
        o[roundedDate][f.properties.type] += 1;
      } else {
        o[roundedDate]["Autres"] += 1;
      }
      return o;
    },
    // 78 months between 2012/07 and 2018/12
    new Array(78).fill(0).map(() =>
      categoriesList.reduce((a, l) => {
        a[l] = 0;
        return a;
      }, {})
    )
  );

  onMount(async () => {
    d3 = await import("d3");
    initializeGraph();
  });

  function onCategoryClick(c) {
    let newFilters = [...$filters];
    let i = newFilters.indexOf(c);
    if (i > -1) {
      newFilters.splice(i, 1);
    } else {
      newFilters = [c]; // or newFilters.push(c) if we want cummulative filters?
    }
    filters.set(newFilters);
  }

  function initializeGraph() {
    const width = graphWidth - 2 * margin;
    const height = graphHeight - 2 * margin;

    d3.select("#graph")
      .selectAll("svg")
      .remove();

    svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", width + 2 * margin)
      .attr("height", height + 2 * margin);

    svg.append("g").attr("transform", `translate(${margin}, ${margin})`);

    x = d3
      .scaleTime()
      .domain([new Date(2012, 6, 1), new Date(2018, 11, 1)])
      .range([0, width]);

    y = d3.scaleLinear().range([height, 0]);

    // stack generator that takes counts in input
    stack = d3.stack().keys(categoriesList);

    // area generator that takes a d3 stack in input
    area = d3
      .area()
      .x((d, i) => x(new Date(2012, 6 + i, 1)))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
      .curve(d3.curveMonotoneX);

    const series = stack(counts);
    y.domain([0, d3.max(series[series.length - 1], d => d[1])]);

    path = svg
      .select("g")
      .selectAll("path")
      .data(series)
      .enter()
      .append("path")
      .attr("d", area)
      .attr("fill", d => categories[d.key]);

    svg
      .select("g")
      .append("g")
      .attr("class", "xaxis")
      .attr(
        "style",
        "text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white;"
      )
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
  }

  $: {
    counts;
    graphWidth;
    if (d3) {
      console.log("here");
      // why doesn't resize work?
      // svg.attr("width", graphWidth);
      // x.range([0, graphWidth - 2 * margin]);

      const series = stack(counts);
      y.domain([0, d3.max(series[series.length - 1], d => d[1])]);

      path
        .data(series)
        .transition()
        .attr("d", area);
    }
  }
</script>

<div
  class="absolute bottom-0 h5 w-100 pa1 flex items-center z-2"
  style="pointer-events: none;">
  <div
    class="pa2 ml3 mb5 bg-white-80 br2 shadow-1"
    style="pointer-events: auto; backdrop-filter: blur(6px);">
    {#each categoriesList as c}
      <div class="pt2 pointer" on:click={() => onCategoryClick(c)}>
        <div class="w1 h1 relative dib mr2">
          <div
            class="w-100 h-100 br-100 absolute"
            style="background-color: {categories[c]}" />
          {#if $filters.length && $filters.indexOf(c) > -1}
            <div
              class="w-100 h-100 br-100 ba bw2 absolute"
              style="border-color: rgba(255, 255, 255, 0.7)" />
            <div
              class="w-100 h-100 br-100 ba bw1 absolute"
              style="border-color: #000" />
          {/if}
        </div>
        {c}
      </div>
    {/each}
  </div>

  <div
    id="graph"
    class="flex-grow-1 h-100 mb5"
    bind:offsetWidth={graphWidth}
    bind:offsetHeight={graphHeight} />
  <!-- TODO with rendered features and display a line chart here with the number
  of claims and a pie chart with the proportion of each type. The pie chart has
  a legend that serves as filters (along with a select all and deselect all
  buttons?). We'll probably want a "normalize" button to see the proportion of
  claims of each type through time. If we have a "play" mode we'll want sparkles
  like in escapades :) -->
</div>
