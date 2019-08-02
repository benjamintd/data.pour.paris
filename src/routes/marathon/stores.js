import { writable } from "svelte/store";

export const featureCollection = writable({
  type: "FeatureCollection",
  features: []
});

export const time = writable(0);
export const playing = writable(false);
export const turbo = writable(false);
