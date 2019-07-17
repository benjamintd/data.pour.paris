<script>
  import colorTemperatureToRGB from "./colorTemperatureToRGB.js";

  export let props;

  $: color = colorTemperatureToRGB(props.tempcouleu);
</script>

<style>
  :global(.mapboxgl-popup-content) {
    background-color: #31486d;
  }

  :global(.mapboxgl-popup-anchor-right .mapboxgl-popup-tip) {
    border-left-color: #31486d !important;
  }
  :global(.mapboxgl-popup-anchor-left .mapboxgl-popup-tip) {
    border-right-color: #31486d !important;
  }
  :global(.mapboxgl-popup-anchor-top .mapboxgl-popup-tip) {
    border-bottom-color: #31486d !important;
  }
  :global(.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip) {
    border-top-color: #31486d !important;
  }

  .icon {
    display: inline-flex;
    align-self: center;
  }

  .icon svg {
    top: 0.125em;
    position: relative;
    height: 1em;
    width: 1em;
  }

  table {
    border-spacing: 0;
  }

  table tr td {
    padding-right: 4px;
  }
</style>

<!-- todo check that the client-side rendering works well -->
<div class="popup pa3 white-90">
  <h1>{props.lib_lumi_1 || 'Éclairage public'}</h1>
  <p class="fw3 white-70">
    <strong>{props.lib_lampef}</strong>
  </p>

  <table>
    {#if props.unitevie_1}
      <tr>
        <td class="ttu fw2">durée de vie</td>
        <td class="b">{props.dureevie_1} {props.unitevie_1.toLowerCase()}</td>
      </tr>
    {/if}
    {#if props.pw_lampe}
      <tr>
        <td class="ttu fw2">puissance</td>
        <td class="b">{props.pw_lampe} watts</td>
      </tr>
    {/if}
    {#if props.tempcouleu}
      <tr>
        <td class="ttu fw2">temperature</td>
        <td class="b">
          {props.tempcouleu}K
          <div class="icon dib v-base ml1">
            <svg height="100%" viewBox="0 0 14 14">
              <circle
                cx="7"
                cy="7"
                r="7"
                fill="rgba({color.r},{color.g},{color.b}, 0.3)" />
              <circle
                cx="7"
                cy="7"
                r="5"
                fill="rgb({color.r},{color.g},{color.b})" />
            </svg>
          </div>
        </td>
      </tr>
    {/if}
  </table>
</div>
