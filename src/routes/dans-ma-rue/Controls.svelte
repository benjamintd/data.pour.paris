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
    hoveredMonthAndYear
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

  let graphX = 0;
  let tweenedX = tweened(0, { duration: 300, easing: cubicOut });
  $: tweenedX.set(graphX);
  let graphTimer = 0;

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
    const width = graphWidth;
    const height = graphHeight;

    d3.select("#graph")
      .selectAll("svg")
      .remove();

    svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", graphWidth)
      .attr("height", graphHeight);

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

    svg
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

      const series = stack(counts);
      y.domain([0, d3.max(series[series.length - 1], d => d[1])]);

      path
        .data(series)
        .transition()
        .attr("d", area);
    }
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

  $: {
    if (x && graphX) {
      let date = x.invert(graphX);
      let month = date.getMonth() + 1; // js months start at 0
      let year = date.getFullYear();
      if (
        month !== $hoveredMonthAndYear.month ||
        year !== $hoveredMonthAndYear.year
      ) {
        hoveredMonthAndYear.set({ month, year });
      }
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
      class="absolute w-100 h-100"
      bind:offsetWidth={graphWidth}
      bind:offsetHeight={graphHeight} />
    {#if graphTimer && x}
      <div
        class="absolute bg-black"
        transition:scale
        style="width: 1px; left: {$tweenedX}px; bottom: {bottomMargin}px; top:
        0;">
        <div
          class="top-0 bg-white br2 tc f6 pv1 shadow-2"
          style="min-width: 100px; margin-left: -50px;">
          {x
            .invert(graphX)
            .toLocaleString('fr-FR', {
              month: 'short',
              year: 'numeric'
            })}
        </div>
      </div>
    {/if}
    <div
      class="absolute w-100 h-25 bottom-0"
      style="pointer-events: auto;"
      on:mousemove={graphMouseMove} />
  </div>
</div>
