<script>
  import { onMount } from "svelte";
  import { renderedFeatures, filters, categories } from "./stores.js";

  let d3;
  let graphWidth;
  let graphHeight;
  let proportionsSize;
  let margin = 30;
  // the d3 objects that we'll reuse (generators and scales)
  let histogram;
  let line;
  let x, y;
  let svg;

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
      .domain([new Date(2012, 6, 1), new Date(2018, 11, 31)])
      .range([0, width]);

    y = d3.scaleLinear().range([height, 0]);

    // histogram generator that takes an array of features in input
    histogram = d3
      .histogram()
      .value(f => new Date(f.properties.datedecl))
      .domain(x.domain())
      .thresholds(x.ticks(d3.timeMonth));

    const bins = histogram($renderedFeatures);

    y.domain([0, d3.max(bins, d => d.length)]);

    // line generator that takes a d3 histogram in input
    line = d3
      .line()
      .x(d => x(d.x0))
      .y(d => y(d.length))
      .curve(d3.curveMonotoneX);

    const path = svg.append("path");

    path
      .datum(bins)
      .attr("d", line)
      .transition()
      .ease(d3.easeLinear)
      .attr("stroke", "#444")
      .attr("stroke-width", 1)
      .attr("fill", "none");

    svg
      .append("g")
      .attr("class", "xaxis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .transition();

    // svg
    //   .append("g")
    //   .attr("class", "yaxis")
    //   .call(d3.axisLeft(y));
  }

  $: {
    $renderedFeatures;
    graphWidth;
    if (d3) {
      // why doesn't resize work?
      svg.attr("width", graphWidth);
      x.range([0, graphWidth - 2 * margin]);

      const bins = histogram($renderedFeatures);
      y.domain([0, d3.max(bins, d => d.length)]);

      svg
        .select("path")
        .datum(bins)
        .transition()
        .ease(d3.easeLinear)
        .attr("d", line)
        .attr("stroke", "#444")
        .attr("stroke-width", 1)
        .attr("fill", "none");

      svg
        .select(".xaxis")
        .transition()
        .attr("transform", `translate(0, ${graphHeight - 2 * margin})`)
        .call(d3.axisBottom(x));
    }
  }
</script>

<div class="h5 w-100 pa1 flex items-center">
  <div class="pl3">
    {#each Object.keys(categories) as c}
      <div class="pt2 pointer" on:click={() => onCategoryClick(c)}>
        <div class="w1 h1 relative dib">
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
  <div id="proportions" class="w4 h4" bind:offsetWidth={proportionsSize} />

  <div
    id="graph"
    class="flex-grow-1 h-100"
    bind:offsetWidth={graphWidth}
    bind:offsetHeight={graphHeight} />
  <!-- TODO with rendered features and display a line chart here with the number
  of claims and a pie chart with the proportion of each type. The pie chart has
  a legend that serves as filters (along with a select all and deselect all
  buttons?). We'll probably want a "normalize" button to see the proportion of
  claims of each type through time. If we have a "play" mode we'll want sparkles
  like in escapades :) -->
</div>
