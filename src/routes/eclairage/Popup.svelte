<script>
  export let props;

  $: color = colorTemperatureToRGB(props.tempcouleu);

  // see https://gist.github.com/paulkaplan/5184275
  function colorTemperatureToRGB(kelvin) {
    var temp = kelvin / 100;
    var red, green, blue;

    if (temp <= 66) {
      red = 255;

      green = temp;
      green = 99.4708025861 * Math.log(green) - 161.1195681661;

      if (temp <= 19) {
        blue = 0;
      } else {
        blue = temp - 10;
        blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
      }
    } else {
      red = temp - 60;
      red = 329.698727446 * Math.pow(red, -0.1332047592);

      green = temp - 60;
      green = 288.1221695283 * Math.pow(green, -0.0755148492);

      blue = 255;
    }

    return {
      r: clamp(red, 0, 255),
      g: clamp(green, 0, 255),
      b: clamp(blue, 0, 255)
    };
  }

  function clamp(x, min, max) {
    if (x < min) {
      return min;
    }
    if (x > max) {
      return max;
    }

    return x;
  }
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
