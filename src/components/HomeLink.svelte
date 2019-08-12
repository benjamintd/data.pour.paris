<script>
  import Logo from "./Logo.svelte";
  import { fly } from "svelte/transition";
  let hover = false;
</script>

<style>
  .logotype {
    font-family: "Bree Serif", serif;
    text-shadow: 0px 0px 2px rgba(255, 255, 255, 0.5);
  }
</style>

<a href="/">
  <div
    class="ma3 absolute z-9999 pointer dib flex flex-row items-center"
    on:mouseenter={() => (hover = true)}
    on:mouseleave={() => (hover = false)}>
    <Logo size={30} />
    {#if hover}
      <div
        transition:fly={{ duration: 300, x: -100, y: 0, opacity: 0 }}
        class="logotype dib ml2 f3 b black">
        data.pour.paris
      </div>
    {/if}
  </div>
</a>
