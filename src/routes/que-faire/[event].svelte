<script context="module">
  import Index from "./index.svelte";
  import { selectedFeature } from "./stores.js";

  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload(page, session) {
    // the `slug` parameter is available because this file
    // is called [slug].svelte
    const { event } = page.params;
    selectedFeature.set(event);
  }
</script>

<Index />
