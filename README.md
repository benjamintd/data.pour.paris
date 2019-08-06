# data.pour.paris

Visualisations de l'open-data parisienne.

Le but de ce projet est de visualiser les jeux de données mis à disposition par la ville de Paris, ses réseaux de transports (Île de France Mobilités, RATP, etc.), ou d'autres.

## Technologies

Cette application est écrite en [Svelte](https://svelte.dev/) et utilise [Sapper](https://sapper.svelte.dev/) (l'équivalent de Next.js pour Svelte). C'est le filesystem qui sert de point d'entrée pour les pages (`src/routes`).

L'api est écrite en Node.js (bientôt en Typescript 🤞).

Le tout est déployé avec [Now](https://zeit.co/now).

## Environnement

Déployer cette app nécessite:

- une [clé d'API Île de France Mobilités](https://opendata.stif.info/pages/api-stif/)
- un compte Amazon Web Services pour mettre en cache les résultats des APIs.
