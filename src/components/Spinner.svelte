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
  <div class="relative" style="height: 40px; width: 40px;">
    <div class="spin absolute w-100 h-100">
      <svg width="40px" height="40px" viewBox="0 0 40 40">
        <circle id="Oval" fill="#D8D8D8" cx="20" cy="2" r="2" />
      </svg>
    </div>
    <div class="absolute w-100 h-100">
      <svg width="40px" height="40px" viewBox="0 0 40 40">
        <g
          id="Group-2"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd">
          <rect fill="#FFFFFF" opacity="0" x="0" y="0" width="40" height="40" />
          <path
            d="M7.70701271,28.5977375 C9.76509446,22.0351166
            12.7405399,20.2478566 17.3629561,21.590685 C20.5649553,22.5208772
            23.0325622,24.0033137 30.7428955,29.2264924 C30.9892616,29.3933872
            31.221507,29.5504527 31.4424058,29.699517 C28.6909579,32.9421473
            24.5857976,35 20,35 C14.9142012,35 10.4195637,32.4689374
            7.70701271,28.5977375 Z M5.857742,25.0119049 C5.30229972,23.4446473
            5,21.7576266 5,20 C5,11.7157288 11.7157288,5 20,5 C28.2842712,5
            35,11.7157288 35,20 C35,22.6213567 34.327586,25.0856627
            33.1458321,27.2298438 C32.9189695,27.0767832 32.6798765,26.9150983
            32.4254509,26.7427438 C24.3839196,21.295203 21.8410845,19.7675725
            18.1998675,18.709786 C12.6687912,17.1029886 8.51659503,19.0470917
            5.857742,25.0119049 Z"
            id="Combined-Shape"
            fill="#D8D8D8" />
        </g>
      </svg>
    </div>
  </div>
</div>
