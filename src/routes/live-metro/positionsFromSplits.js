import cheapRuler from "cheap-ruler";
import { quadInOut } from "svelte/easing";
const ruler = cheapRuler(48.86727, "meters");

function positionsFromSplits(linesHash, splits, now) {
  const currentLines = [];

  for (var j = 0; j < splits.length; j++) {
    let split = splits[j];
    if (split[0] > now) break;
    if (split[split.length - 1] < now) continue;
    let i = findIndex(split, now);
    if (i > -1) {
      currentLines.push([
        split[i + 1],
        (now - split[i]) / (split[i + 2] - split[i])
      ]);
    }
  }

  const features = [];
  currentLines.forEach(l => {
    const line = linesHash[l[0]];
    const progress = l[1];
    const distance = line.properties.distance;
    const coord = ruler.along(
      line.geometry.coordinates,
      quadInOut(progress) * distance
    );
    const pol = ruler.pointOnLine(line.geometry.coordinates, coord);
    const bearing = ruler.bearing(
      line.geometry.coordinates[pol.index],
      line.geometry.coordinates[pol.index + 1]
    );
    const feature = {
      type: "Feature",
      properties: {
        c: line.properties.color,
        b: bearing
      },
      geometry: {
        type: "Point",
        coordinates: coord
      }
    };

    features.push(feature);
  });

  return {
    type: "FeatureCollection",
    features: features
  };
}

function findIndex(split, ts, startIndex, endIndex) {
  // returns the index of the line that's currently being ridden
  // uses binary search
  if (!startIndex) startIndex = 0;
  if (!endIndex) endIndex = split.length - 1;

  if (endIndex - startIndex == 2) {
    if (split[startIndex] <= ts && split[endIndex] > ts) return startIndex;
    else return -1;
  }

  let midIndex = ((startIndex + endIndex) >>> 2) << 1;
  if (ts > split[midIndex]) return findIndex(split, ts, midIndex, endIndex);
  if (ts <= split[midIndex]) return findIndex(split, ts, startIndex, midIndex);
}

export default positionsFromSplits;
