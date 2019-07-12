<script>
  import Logo from "../components/Logo.svelte";
  import Github from "../components/Github.svelte";
</script>

<svelte:head>
  <title>Open Data Paris</title>
</svelte:head>

<div class="flex flex-column">
  <div
    class="shadow-1 w-100 ph4 pv2 flex flex-row-l flex-row-m flex-column
    items-center">
    <a href="/">
      <div class="w2 h2 mr3-l mr3-m">
        <Logo />
      </div>
    </a>
    <div>
      <h1 class="f1-l f1-m f2 mv2">Open&nbsp;Data&nbsp;Paris</h1>
    </div>
    <div class="ml-auto-l ml-auto-m">
      <Github />
    </div>
  </div>

  <div class="ph4">
    <p class="f3 fw2 black-60">visualisations de l'open data parisienne</p>
    <ul>
      <li>
        <a href="trafic">trafic mesuré du mois de juin 2019</a>
      </li>
    </ul>
  </div>
</div>
