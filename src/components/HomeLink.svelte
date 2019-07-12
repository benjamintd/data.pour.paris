<script>
  import Logo from "./Logo.svelte";
  import { fly } from "svelte/transition";
  let hover = false;
</script>

<style>
  .logotype {
    text-shadow: 0px 0px 2px #ffffff;
  }
</style>

<div
  class="ma2 absolute z-3 pointer dib flex flex-row items-center"
  on:mouseenter={() => (hover = true)}
  on:mouseleave={() => (hover = false)}>
  <a href="/">
    <Logo size={32} />
  </a>
  {#if hover}
    <div
      transition:fly={{ duration: 300, x: -100, y: 0, opacity: 0 }}
      class="logotype dib ml2 f3 b">
      Open&nbsp;Data&nbsp;Paris
    </div>
  {/if}
</div>
