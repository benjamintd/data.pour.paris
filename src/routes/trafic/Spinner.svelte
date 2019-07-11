<script>
  import { fade } from "svelte/transition";
  import Logo from "./Logo.svelte";
</script>

<style>
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .spin {
    animation: spin 0.8s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
  }
</style>

<div
  transition:fade
  class="w-100 h-100 absolute flex justify-center items-center z-9999"
  style="background-color: rgba(0, 0, 0, 0.3);">
  <div class="spin" style="height: 36px; width: 36px;">
    <Logo size={36} />
  </div>
</div>
