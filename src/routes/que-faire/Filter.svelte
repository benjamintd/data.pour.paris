<script>
  export let onClick = () => {};
  export let active = false;
</script>

{#if active}
  <div
    class="ba br-pill pointer b--dark-blue pv1 ph2 white bg-blue"
    on:click={() => onClick()}>
    <slot />
  </div>
{:else}
  <div
    class="ba br-pill pointer b--blue pv1 ph2 blue"
    on:click={() => onClick()}>
    <slot />
  </div>
{/if}
