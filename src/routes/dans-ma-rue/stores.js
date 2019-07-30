import { writable } from "svelte/store";

export const categories = {
  Autres: "#598ea1",
  "Éclairage / Électricité": "#e7ab03",
  "Mobiliers urbains": "#a6761d",
  "Autos, motos, vélos...": "#14b9f0",
  "Voirie et espace public": "#1a9e76",
  Propreté: "#46208d",
  "Graffitis, tags, affiches et autocollants": "#e7288a",
  "Objets abandonnés": "#7e8773"
};

export const categoriesList = Object.keys(categories).reverse();

export const filters = writable([]);
export const renderedFeatures = writable([]);
export const dateSelection = writable([]);
