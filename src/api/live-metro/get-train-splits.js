// TODO rewrite in Typescript, now natively supported by @now/node I think
// TODO watch log usage and if cached well.

"use strict";
const cheapRuler = require("cheap-ruler");
const _ = require("lodash");
const graph = require("./graph.json");
const linesHash = require("./linesHash.json");
const shortestPath = require("./shortest-path.js");
const fetchAllStops = require("./get-train-times");

const DEFAULT_SPEED = 6.5; // m.s-1
const RER_SPEED = 10; // m.s-1

const ruler = cheapRuler(48.86727, "meters");

function trainTimesToSplits(trainTimes) {
  let splits = [];
  trainTimes.forEach(train => {
    let path = [];

    // get path, return if there's none
    try {
      path = shortestPath(
        graph,
        train.lineRef,
        train.currentStop,
        train.destination
      );
    } catch (e) {
      return;
    } finally {
      if (!path) return;
    }

    let lastSplit = new Date(train.expectedDepartureTime).getTime() / 1000;
    let trainSplits = [Math.round(lastSplit)];

    // find times for each stop
    // TODO should we estimate a position before the first split?
    // This requires making a guess of the path of the train before the first
    // station for which we have data. This is doable but hard.
    for (let i = 0; i < path.length; i++) {
      trainSplits.push(path[i]);
      let line = linesHash[path[i]];
      let distance = ruler.lineDistance(
        linesHash[path[i]].geometry.coordinates
      );
      let time = line.properties.reseau.startsWith("RER")
        ? distance / RER_SPEED
        : distance / DEFAULT_SPEED;
      let split = lastSplit + time;
      lastSplit = split;
      trainSplits.push(Math.round(split));
    }
    splits.push(trainSplits);
  });
  return splits;
}

function deduplicateSplitsAndSort(splits) {
  const min_difference = 90; // seconds between trains considered similar
  splits = splits.sort((a, b) => {
    // sort by last line then by arrival time
    if (a[a.length - 2] != b[b.length - 2]) {
      if (a[a.length - 2] < b[b.length - 2]) return -1;
    } else {
      if (a[a.length - 1] < b[b.length - 1]) return -1;
    }
    return 1;
  });

  let lastValidTime = 0;
  let lastValidLine = "";
  let validSplits = [];
  console.log("before filter", splits.length);
  for (let i = 0; i < splits.length; i++) {
    let s = splits[i];
    if (s[s.length - 2] === lastValidLine) {
      if (Math.abs(lastValidTime - s[s.length - 1]) < min_difference) continue;
      else {
        lastValidTime = s[s.length - 1];
        validSplits.push(s);
      }
    } else {
      lastValidLine = s[s.length - 2];
      lastValidTime = s[s.length - 1];
      validSplits.push(s);
    }
  }
  console.log("after filter", validSplits.length);

  return validSplits.sort((a, b) => a[0] - b[0]); // smallest first
}

module.exports = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");

    var trainTimes = await fetchAllStops(req);
    var splits = deduplicateSplitsAndSort(trainTimesToSplits(trainTimes));
    res.end(JSON.stringify(splits));
  } catch (e) {
    console.log("error getting splits", e);
    throw e;
  }
};
