<script>
  import { onMount } from "svelte";
  import {
    renderedFeatures,
    filters,
    categories,
    categoriesList,
    dateSelection
  } from "./stores.js";

  let d3;
  let graphWidth;
  let graphHeight;
  let proportionsSize;

  const bottomMargin = 20;

  // the d3 objects that we'll reuse (generators and scales)
  let stack;
  let area;
  let x, y;
  let svg;
  let path;
  let xAxis;

  let graphHovered = false;
  let dateOffset = 0;
  let selectionDown = 0;
  let selectionUp = 0;
  let selectionHover = 0;

  $: selection =
    selectionDown && selectionUp
      ? [
          Math.min(selectionDown, selectionUp),
          Math.max(selectionDown, selectionUp)
        ]
      : [];

  $: tempSelection =
    selectionDown && selectionHover
      ? [
          Math.min(selectionDown, selectionHover),
          Math.max(selectionDown, selectionHover)
        ]
      : [];

  $: dateSelection.set(selection);

  function resetGraphSelection() {
    selectionDown = 0;
    selectionUp = 0;
  }

  // get an array of {type: count}[] for each month between 2012/07 and 2018/12
  $: counts = $renderedFeatures.reduce(
    (o, f) => {
      const date = new Date(f.properties.datedecl);
      const roundedDate =
        12 * (date.getFullYear() - 2012) + (date.getMonth() - 6);
      if (o[roundedDate][f.properties.type] !== undefined) {
        o[roundedDate][f.properties.type] += 1;
      } else {
        o[roundedDate]["Autres"] += 1;
      }
      return o;
    },
    // 79 months between 2012/07 and 2018/12
    new Array(79).fill(0).map(() =>
      // empty {type: 0} object with all types
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
    d3.select("#graph")
      .selectAll("svg")
      .remove();

    svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .attr("class", "absolute z-1");

    x = d3
      .scaleTime()
      .domain([new Date(2012, 6, 1), new Date(2018, 11, 31)])
      .range([0, graphWidth]);

    y = d3.scaleLinear().range([graphHeight - bottomMargin, 0]);

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
      .selectAll("path")
      .data(series)
      .enter()
      .append("path")
      .attr("d", area)
      .attr("fill", d => categories[d.key]);

    xAxis = svg
      .append("g")
      .attr("class", "xaxis")
      .attr("transform", `translate(0, ${graphHeight - bottomMargin})`)
      .call(d3.axisBottom(x));
  }

  $: {
    counts;
    graphWidth;
    if (d3) {
      // why doesn't resize work?
      svg.attr("width", graphWidth);
      x.range([0, graphWidth]);
      xAxis.transition();

      const series = stack(counts);
      y.domain([0, d3.max(series[series.length - 1], d => d[1])]);

      path
        .data(series)
        .transition()
        .attr("d", area);
    }
  }

  function onGraphMouseMove(e) {
    graphHovered = true;
    dateOffset = e.offsetX;
    selectionHover = x.invert(e.offsetX);
  }

  function onGraphMouseDown(e) {
    selectionUp = 0;
    selectionDown = x.invert(e.offsetX);
  }

  function onGraphMouseUp(e) {
    selectionUp = x.invert(e.offsetX);
  }
</script>

<div class="h5 w-100 pa1 flex items-center">
  <div class="pl3">
    {#each categoriesList as c}
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

  <div class="flex-grow-1 h-100 flex pa4">
    <div
      id="graph"
      class="flex-grow-1 relative"
      bind:offsetWidth={graphWidth}
      bind:offsetHeight={graphHeight}>
      {#if graphHovered}
        <div
          class="bg-black absolute z-2"
          style="width: 1px; left: {dateOffset}px; top: 0; bottom: {bottomMargin}px;" />
      {/if}

      {#if selection.length}
        <div
          class="bg-black-30 absolute z-2"
          style="width: {x(selection[1]) - x(selection[0])}px; left: {x(selection[0])}px;
          top: 0; bottom: {bottomMargin}px;" />
      {:else if tempSelection.length}
        <div
          class="bg-black-20 absolute z-2"
          style="width: {x(tempSelection[1]) - x(tempSelection[0])}px; left: {x(tempSelection[0])}px;
          top: 0; bottom: {bottomMargin}px;" />
      {/if}
      <div
        class="absolute w-100 h-100 z-3"
        on:mousemove={onGraphMouseMove}
        on:mouseenter={() => (graphHovered = true)}
        on:mouseleave={() => (graphHovered = false)}
        on:mousedown={onGraphMouseDown}
        on:mouseup={onGraphMouseUp} />
      {#if selection.length}
        <button
          class="absolute white button bg-blue br2 top left z-5"
          on:click={resetGraphSelection}>
          reset
        </button>
      {/if}
    </div>
  </div>
  <!-- TODO with rendered features and display a line chart here with the number
  of claims and a pie chart with the proportion of each type. The pie chart has
  a legend that serves as filters (along with a select all and deselect all
  buttons?). We'll probably want a "normalize" button to see the proportion of
  claims of each type through time. If we have a "play" mode we'll want sparkles
  like in escapades :) -->
</div>
