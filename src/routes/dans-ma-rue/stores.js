import { writable } from "svelte/store";

export const categories = {
  Autres: "#b5b5b5",
  "Éclairage / Électricité": "#edc912",
  "Mobiliers urbains": "#28659f",
  "Autos, motos, vélos...": "#2fbcf4",
  "Voirie et espace public": "#1aa978",
  Propreté: "#4f7a8c",
  "Graffitis, tags, affiches et autocollants": "#ed4a7a",
  "Objets abandonnés": "#945ed0"
};

export const categoriesList = Object.keys(categories).reverse();

export const filters = writable([]);
export const renderedFeatures = writable([]);
