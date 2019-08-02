<script>
  import { time, playing } from "./stores.js";

  let previousAnimationTimestamp = 0;
  const maxTime = 570; // in minutes after the first start

  let sliderValue;
  $: speedValue = 100 - sliderValue;

  $: {
    $playing;
    animationStep();
  }

  function animationStep(t) {
    if ($playing) {
      if ($time < maxTime) {
        if (t - previousAnimationTimestamp > speedValue) {
          time.update(n => Math.min(n + 1, maxTime));
          previousAnimationTimestamp = t;
        }
        requestAnimationFrame(animationStep);
      } else {
        playing.set(false);
        time.set(0);
      }
    }
  }
</script>

<style>
  .button {
    box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.1);
  }

  .button:hover {
    box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.2);
  }

  .button:active {
    transform: translateY(3px);
    box-shadow: 0px 1px 2px 2px rgba(0, 0, 0, 0.2);
  }
</style>

<div class="flex flex-column items-center justify-center pa3">
  <div
    class="button flex items-center justify-center br-100 w3 h3 pointer"
    on:click={() => {
      playing.update(p => !p);
    }}>
    {#if $playing}
      <!-- pause -->
      <svg height="60%" viewBox="0 0 5 8">
        <g fill="#000000">
          <path
            d="M0.5,0 L1.5,0 C1.77614237,-5.07265313e-17 2,0.223857625 2,0.5
            L2,7.5 C2,7.77614237 1.77614237,8 1.5,8 L0.5,8 C0.223857625,8
            3.38176876e-17,7.77614237 0,7.5 L0,0.5 C-3.38176876e-17,0.223857625
            0.223857625,5.07265313e-17 0.5,0 Z" />
          <path
            d="M3.5,0 L4.5,0 C4.77614237,-5.07265313e-17 5,0.223857625 5,0.5
            L5,7.5 C5,7.77614237 4.77614237,8 4.5,8 L3.5,8 C3.22385763,8
            3,7.77614237 3,7.5 L3,0.5 C3,0.223857625 3.22385763,5.07265313e-17
            3.5,0 Z" />
        </g>
      </svg>
    {:else}
      <!-- play -->
      <svg height="60%" viewBox="0 0 8 10">
        <path
          d="M1,0.971594662 L1,9.02840534 C1,9.30454771 1.22385763,9.52840534
          1.5,9.52840534 C1.60421149,9.52840534 1.70581872,9.49584377
          1.7906191,9.43527207 L7.43038657,5.40686674 C7.65509286,5.24636224
          7.7071387,4.9340872 7.54663421,4.7093809 C7.51456438,4.66448314
          7.47528433,4.62520309 7.43038657,4.59313326 L1.7906191,0.564727926
          C1.5659128,0.404223431 1.25363776,0.456269272 1.09313326,0.680975565
          C1.03256157,0.765775941 1,0.867383174 1,0.971594662 Z"
          fill="#000000" />
      </svg>
    {/if}
  </div>
  <div class="pt4 ph2 f2">
    🚶‍♀️
    <input type="range" bind:value={sliderValue} min="0" max="100" value="50" />
    🏃‍♀️
  </div>
</div>
