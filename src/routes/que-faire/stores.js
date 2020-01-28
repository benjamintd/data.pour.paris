import { writable } from "svelte/store";

export const featureCollection = writable({
  type: "FeatureCollection",
  features: []
});

export const selectedFeature = writable(-1);

export const activeFilter = writable("all");
export const filters = [
  ["all", "Tous"],
  ["today", "Aujourd'hui"],
  ["tomorrow", "Demain"],
  ["week-end", "Ce Week-end"]
];

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

export function filterFeatures(fc, activeFilter) {
  if (activeFilter === "all") {
    return fc;
  } else {
    let filterStart = new Date();
    let filterEnd = new Date();
    switch (activeFilter) {
      case "today": {
        filterStart.setHours(0, 0, 0, 0);
        filterEnd.setHours(24, 0, 0, 0);
        break;
      }
      case "tomorrow": {
        filterStart.setDate(filterStart.getDate() + 1);
        filterStart.setHours(0, 0, 0, 0);
        filterEnd.setDate(filterStart.getDate() + 1);
        filterStart.setHours(0, 0, 0, 0);
        break;
      }
      case "week-end": {
        let saturdayOffset = (-1 + 7 - filterStart.getDay()) % 7;
        filterStart.setDate(filterStart.getDate() + saturdayOffset);
        filterStart.setHours(0, 0, 0, 0);
        filterEnd.setDate(filterEnd.getDate() + saturdayOffset + 1);
        filterStart.setHours(24, 0, 0, 0);
        break;
      }
      default:
        break;
    }
    return {
      type: "FeatureCollection",
      features: fc.features.filter(
        f =>
          new Date(f.properties.date_end) >= filterStart &&
          new Date(f.properties.date_start) <= filterEnd
      )
    };
  }
}
