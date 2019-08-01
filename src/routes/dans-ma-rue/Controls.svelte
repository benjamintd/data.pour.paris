<script>
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { scale } from "svelte/transition";
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

  function resetGraphSelection() {
    selectionDown = 0;
    selectionUp = 0;
    dateSelection.set([]);
  }

  function graphMouseMove(e) {
    graphX = e.offsetX;
    clearTimeout(graphTimer);
    graphTimer = setTimeout(() => {
      graphTimer = 0;
      graphX = 0;
      hoveredMonthAndYear.set({ month: 0, year: 0 });
    }, 1500);
  }

  function onGraphMouseMove(e) {
    if (x) {
      graphHovered = true;
      dateOffset = e.offsetX;
      selectionHover = x.invert(e.offsetX);
    }
  }

  function onGraphMouseDown(e) {
    if (x) {
      selectionUp = 0;
      selectionDown = x.invert(e.offsetX);
    }
  }

  function onGraphMouseUp(e) {
    if (x) {
      selectionUp = x.invert(e.offsetX);
      if (Math.abs(selectionDown - selectionUp) > 24 * 60 * 60 * 1000) {
        dateSelection.set([
          Math.min(selectionDown, selectionUp),
          Math.max(selectionDown, selectionUp)
        ]);
      } else {
        dateSelection.set([]);
      }
    }
  }

  // get an array of {type: count}[] for each month between 2012/07 and 2018/12
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
      .domain([new Date(2012, 6, 1), new Date(2018, 11, 1)])
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
      .attr(
        "style",
        "text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white;"
      )
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
</script>

<div
  class="absolute bottom-0 h5 w-100 pa1 pb4 flex items-center z-2"
  style="pointer-events: none;">
  <div
    class="pa2 ml3 mb4 bg-white-80 br2 shadow-1"
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

  <div class="relative flex-grow-1 h-100 mb4 mh3">
    <div
      id="graph"
      class="absolute w-100 h-100 z-5"
      bind:offsetWidth={graphWidth}
      bind:offsetHeight={graphHeight} />
    {#if graphHovered && x}
      <div
        transition:scale
        class="bg-black absolute z-5"
        style="width: 1px; left: {dateOffset}px; top: 0; bottom: {bottomMargin}px;">
        <div
          class="top-0 bg-white br2 tc f6 pv1 shadow-2"
          style="min-width: 100px; margin-left: -50px;">
          {x
            .invert(dateOffset)
            .toLocaleString('fr-FR', {
              month: 'short',
              year: 'numeric'
            })}
        </div>
      </div>
    {/if}

    {#if selection.length}
      <div
        class="bg-black-20 absolute z-2"
        style="width: {x(selection[1]) - x(selection[0])}px; left: {x(selection[0])}px;
        top: 0; bottom: {bottomMargin}px;" />
    {:else if tempSelection.length}
      <div
        class="bg-black-10 absolute z-2"
        style="width: {x(tempSelection[1]) - x(tempSelection[0])}px; left: {x(tempSelection[0])}px;
        top: 0; bottom: {bottomMargin}px;" />
    {/if}
    <div
      class="absolute w-100 h-50 z-3 bottom-0"
      style="pointer-events: auto; cursor: col-resize;"
      on:mousemove={onGraphMouseMove}
      on:mouseenter={() => (graphHovered = true)}
      on:mouseleave={() => (graphHovered = false)}
      on:mousedown={onGraphMouseDown}
      on:mouseup={onGraphMouseUp} />
    {#if $dateSelection.length}
      <button
        class="absolute white button bg-gray br2 top left z-5 pointer"
        style="pointer-events: auto;"
        on:click={resetGraphSelection}>
        réinitialiser
      </button>
    {/if}
  </div>
</div>
