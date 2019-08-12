<script>
  import Logo from "../components/Logo.svelte";
  import Github from "../components/Github.svelte";
  import Twitter from "../components/Twitter.svelte";
  import Email from "../components/Email.svelte";
  import Preview from "../components/Preview.svelte";
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
  <title>Data Pour Paris</title>
</svelte:head>

<div class="flex flex-column">

  <div
    class="bg-near-white bb b--moon-gray shadow-4 w-100 ph4 pv2 flex flex-row-l
    flex-row-m flex-column items-center">
    <a href="/">
      <div class="w2 h2 mr3-l mr3-m logo">
        <Logo fill="#001B44" />
      </div>
    </a>
    <span class="logotype f1-l f1-m f2 mv2 navy">data.pour.paris</span>

    <div class="ml-auto-l ml-auto-m">
      <Github />
    </div>
  </div>

  <div class="ph4">
    <p class="f4 pa3 f3-l pa4-l fw3 lh-copy tc">
      Décryptez l'activité de notre capitale avec les visualisations de
      <span class="logotype">data.pour.paris</span>
      🗺🥖
    </p>
    <div class="flex flex-row flex-wrap justify-around">
      <Preview name="trafic">trafic mesuré du mois de juin 2019</Preview>
      <Preview name="eclairage">éclairage public de la ville</Preview>
      <Preview name="dans-ma-rue">
        historique de l'application Dans Ma Rue
      </Preview>
      <Preview name="live-metro">posititon des métros en temps réel</Preview>
      <Preview name="marathon">
        parcours des finishers du maration de Paris 2018
      </Preview>
      <Preview />
    </div>
  </div>
  <div class="footer fw2 f6 bg-near-white gray pa3 mt4 bt b--moon-gray">
    <p>Made with ♥ in the open by benjamintd</p>
    <span>Got some ideas? Come say hi!</span>
    <div class="pb2 dib">
      <div class="ph1 dib" />
      <Github fill="#777" />
      <div class="ph1 dib" />
      <Twitter fill="#777" />
      <div class="ph1 dib" />
      <Email fill="#777" />
    </div>
  </div>
</div>
