<script>
  import Logo from "../components/Logo.svelte";
  import Github from "../components/Github.svelte";
</script>

<style>
  .logotype {
    font-family: "Bree Serif", serif;
  }

  .logo {
    margin-bottom: -0.7rem;
  }
</style>

<svelte:head>
  <title>Open Data Paris</title>
</svelte:head>

<div class="flex flex-column">

  <div
    class="bg-near-white shadow-1 w-100 ph4 pv2 flex flex-row-l flex-row-m
    flex-column items-center">
    <a href="/">
      <div class="w2 h2 mr3-l mr3-m logo">
        <Logo fill="black" />
      </div>
    </a>
    <span class="logotype f1-l f1-m f2 mv2">data.pour.paris</span>

    <div class="ml-auto-l ml-auto-m">
      <Github />
    </div>
  </div>

  <div class="ph4">
    <p class="f3 fw2 black-60">visualisations de l'open data parisienne</p>
    <ul class="lh-copy">
      <li>
        <a href="trafic">trafic mesuré du mois de juin 2019</a>
      </li>
      <li>
        <a href="eclairage">éclairage public de la ville</a>
      </li>
      <li>
        <a href="dans-ma-rue">
          historique des signalements de l'application Dans Ma Rue
        </a>
      </li>
      <li>
        <a href="live-metro">posititon des métros en temps réel</a>
      </li>
      <li>
        <a href="marathon">parcours des finishers du maration de Paris 2018</a>
      </li>
    </ul>
  </div>
</div>
