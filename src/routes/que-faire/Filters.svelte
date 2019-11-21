<script>
  import Filter from "./Filter.svelte";
  import { activeFilter, filters } from "./stores.js";
</script>

<div
  class="bg-light-gray pl5 pr0 pr5-l flex justify-around items-center"
  style="height: calc(2rem + 30px); min-height: calc(2rem + 30px)">
  {#each filters as filter (filter[0])}
    <Filter
      active={$activeFilter === filter[0]}
      onClick={() => activeFilter.set(filter[0])}>
      {filter[1]}
    </Filter>
  {/each}
</div>
