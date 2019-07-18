<script>
  export let props;

  $: console.log(props);
</script>

<style>
  :global(.mapboxgl-popup-content) {
    background-color: #285a81;
    max-width: 300px !important;
  }

  :global(.mapboxgl-popup-anchor-right .mapboxgl-popup-tip) {
    border-left-color: #285a81 !important;
  }
  :global(.mapboxgl-popup-anchor-left .mapboxgl-popup-tip) {
    border-right-color: #285a81 !important;
  }
  :global(.mapboxgl-popup-anchor-top .mapboxgl-popup-tip) {
    border-bottom-color: #285a81 !important;
  }
  :global(.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip) {
    border-top-color: #285a81 !important;
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
  <h1 class="f4">{props.type || 'Signalement'}</h1>
  {#if props.soustype}
    <h2 class="f5 fw2 white-70">{props.soustype}</h2>
  {/if}
  <table>
    {#if props.datedecl}
      <tr>
        <td class="ttu fw2">date</td>
        <td class="b">
          {new Date(props.datedecl).toLocaleString('fr-FR', {
            timeZone: 'Europe/Paris',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </td>
      </tr>
    {/if}
    {#if props.adresse}
      <tr>
        <td class="ttu fw2">adresse</td>
        <td class="b">{props.adresse.split(',')[0]}</td>
      </tr>
    {/if}
  </table>
</div>
