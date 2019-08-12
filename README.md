<p align="center">
  <img src="https://raw.githubusercontent.com/benjamintd/data.pour.paris/9ee8bb3612a1b4bb715f40a3ef2c76fb2e8df723/static/favicon.png" width="150" title="logo">
</p>

# data.pour.paris

Visualisations de l'open-data parisienne.

Le but de ce projet est de visualiser les jeux de données mis à disposition par la ville de Paris, ses réseaux de transports (Île de France Mobilités, RATP, etc.), ou d'autres.

## Technologies

Cette application est écrite en [Svelte](https://svelte.dev/) et utilise [Sapper](https://sapper.svelte.dev/) (l'équivalent de Next.js pour Svelte). C'est le filesystem qui sert de point d'entrée pour les pages (`src/routes`).

L'api est écrite en Node.js.

Le tout est déployé avec [Now](https://zeit.co/now).

## Environnement

Déployer cette app nécessite:

- une [clé d'API Île de France Mobilités](https://opendata.stif.info/pages/api-stif/)
- un compte Amazon Web Services pour mettre en cache les résultats des APIs.
