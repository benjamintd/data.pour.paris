<script>
  import { onMount } from "svelte";
  import { time, featureCollection } from "./stores";
  import Play from "./Play.svelte";
  import _ from "lodash";

  // they'll be defined client-side because d3 needs the `document`.
  let d3, line, colorScale;

  onMount(async () => {
    d3 = await import("d3");
  });

  let graphWidth;
  let graphHeight;
  let svg;

  $: densities = smooth($featureCollection.features, "densities", 43, 15);

  $: speeds = smooth($featureCollection.features, "speeds", 43, 30);

  function smooth(features, property, range, kernel) {
    if (!features.length) return [];

    return _.range(range).map(km =>
      features
        .slice(
          Math.max(0, 20 * km - kernel),
          Math.min(features.length, 20 * km + kernel)
        )
        .reduce(
          (a, b, _, d) =>
            a.map((e, i) => e + b.properties[property][i] / d.length),
          features[0].properties[property].map(e => 0)
        )
    );
  }

  $: {
    // re-initialize the graph when we have d3 and a new featurecollection
    if (d3 && densities.length && speeds.length) {
      initializeGraph();
    }
  }

  function initializeGraph() {
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = graphWidth - margin.left - margin.right;
    const height = graphHeight - margin.top - margin.bottom;

    d3.select("#graph")
      .selectAll("svg")
      .remove();

    svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3
      .scaleLinear()
      .range([0, width])
      .domain([0, densities.length]);

    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(densities, d => d3.max(d))]);

    line = d3
      .line()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveBasis); // apply smoothing to the line

    colorScale = d3
      .scaleLinear()
      .domain([0, 8, 11, 14, 18]) // the same scale as the one used in the mapbox style
      .range(["#aaa", "#ffea05", "#de5f63", "#9410a0", "#110787"]);

    // define gradient
    let gradient = d3
      .select("#graph")
      .select("svg")
      .append("defs")
      .append("linearGradient")
      .attr("id", "speedGradient")
      .selectAll("stop")
      .data(speeds.map(s => s[0]))
      .enter()
      .append("stop")
      .attr("offset", (d, i, data) => {
        return i / data.length;
      })
      .attr("stop-color", d => colorScale(d));

    // draw line
    svg
      .append("path")
      .datum(densities.map(d => d[0]))
      .attr("d", line)
      .attr("stroke", "url(#speedGradient)")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    svg
      .append("g")
      .attr("class", "xaxis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
  }

  $: {
    if (d3 && $featureCollection && $time && svg) {
      let gradientSelection = d3
        .select("#speedGradient")
        .selectAll("stop")
        .data(speeds.map(s => s[$time]))
        .transition()
        .duration(20)
        .attr("offset", (d, i, data) => i / data.length)
        .attr("stop-color", d => colorScale(d));

      svg
        .select("path")
        .datum(densities.map(d => d[$time]))
        .transition()
        .duration(20)
        .attr("d", line);
    }
  }
</script>

<div class="flex flex-row-ns flex-column w-100" style="user-select: none;">
  <Play />
  <div class="h5 flex-grow-1 w-100 dn flex-ns pa3">
    <div
      class="flex-grow-1 relative"
      id="graph"
      bind:offsetWidth={graphWidth}
      bind:offsetHeight={graphHeight}>
      <table class="absolute top-0 right-0 pr3 pt2 f6">
        <tbody>
          <tr>
            <td class="tc">↦</td>
            <td>parcours en km</td>
          </tr>
          <tr>
            <td class="tc">↥</td>
            <td>densité en coureurs</td>
          </tr>
          <tr>
            <td>
              <div
                class="mr1"
                style="background: linear-gradient(to right, #ffea05, #de5f63,
                #9410a0,#110787); height: 12px; width: 30px;" />
            </td>
            <td>vitesse moyenne</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
