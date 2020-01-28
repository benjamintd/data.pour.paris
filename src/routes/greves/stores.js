import { writable } from "svelte/store";

export const currentTimestamp = writable(0);

export const featureCollection = writable({
  type: "FeatureCollection",
  features: []
});

export const playing = writable(false);
