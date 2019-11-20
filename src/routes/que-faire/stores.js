import { writable } from "svelte/store";

export const featureCollection = writable({
  type: "FeatureCollection",
  features: []
});

export const selectedFeature = writable(-1);

export const tags = [
  "Ados",
  "Musique",
  "En famille",
  "Enfants",
  "Expos",
  "Sport",
  "Bibliothèques",
  "Solidaire",
  "Gourmand",
  "Insolite",
  "Plein air",
  "Cinéma",
  "Les Nuits",
  "Noël",
  "Urbain",
  "Geek",
  "Queer Lgbt",
  "Végétalisons Paris",
  "English"
];
