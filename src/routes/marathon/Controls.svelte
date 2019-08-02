<script>
  import { time } from "./stores";
  import Play from "./Play.svelte";
</script>

<!-- TODO
A graph where we see the progression of the ppl across time
The x axis is the kilometers (0 -> 42)
the y axis is the density
the color is the speed (not calculated yet, compute it from https://github.com/benjamintd/paris-marathon/blob/data-scripts/static/splits.json)
I lost the script to generate the densities unfortunately...
A play/pause button, and perhaps some info on hover.
 -->
<div class="h5 flex flex-row items-center">
  <Play />
</div>
