<script>
  export let name = "";
</script>

{#if name}
  <div class=" w-80 w-40-l f5 f4-l tc pa2 pb3 grow">
    <a href={name}>
      <img class="ba b--gray mb1" src="images/{name}.jpg" alt={name} />
      <slot />
    </a>
  </div>
{:else}
  <div class=" w-80 w-40-l pa2" />
{/if}
