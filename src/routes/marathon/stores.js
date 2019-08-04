import { writable } from "svelte/store";

export const featureCollection = writable({
  type: "FeatureCollection",
  features: []
});

export const minTime = 10; // nothing happens in the first 10 minutes
export const maxTime = 540; // minutes after the official start time
export const startDate = new Date(2018, 3, 8, 8, 20); // started at 8:20am on april 8th 2018
export const time = writable(minTime);
export const playing = writable(false);
export const turbo = writable(false);
