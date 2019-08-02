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
  class="w-100 h-100 absolute flex justify-center items-center z-999"
  style="background-color: rgba(0, 0, 0, 0.3);">
  <div class="relative" style="height: 40px; width: 40px;">
    <div class="spin absolute w-100 h-100">
      <svg width="40px" height="40px" viewBox="0 0 40 40">
        <circle id="Oval" fill="#D8D8D8" cx="20" cy="2" r="2" />
      </svg>
    </div>
    <div class="absolute w-100 h-100 flex justify-center items-center">
      <Logo size={28} fill="#D8D8D8" />
    </div>
  </div>
</div>
