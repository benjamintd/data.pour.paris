"use strict";

const AWS = require("aws-sdk");
const cheapRuler = require("cheap-ruler");
const _ = require("lodash");
const shortestPath = require("./shortest-path.js");
const fetchAllStops = require("./get-train-times");

const graph = require("./graph.json");
const linesHash = require("./linesHash.json");

// @todo write a better estimate of the speed
// it may depend on the line's geometry, length, and reseau (RER or metro or tram)
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
  let lastValidSplit = null;
  let validSplits = [];
  console.log("before filter", splits.length);
  for (let i = 0; i < splits.length; i++) {
    let s = splits[i];
    // the trains are the same, they need to be deduplicated.
    // we chose the one with the longest splits (i.e. the further up the path)
    if (
      lastValidSplit &&
      lastValidLine === s[s.length - 2] &&
      Math.abs(lastValidTime - s[s.length - 1]) < min_difference
    ) {
      // we keep the longest one
      if (s.length <= lastValidSplit.length) continue;
      // else we'll replace the lastvalidsplit with the longest line
    } else if (lastValidSplit) {
      validSplits.push(lastValidSplit);
    }
    lastValidLine = s[s.length - 2];
    lastValidTime = s[s.length - 1];
    lastValidSplit = s;
  }
  // push last bit
  validSplits.push(lastValidSplit);
  console.log("after filter", validSplits.length);

  return validSplits.sort((a, b) => a[0] - b[0]); // smallest first
}

function handler(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const dynamo = new AWS.DynamoDB({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: "eu-west-3"
    });

    // get latest item
    dynamo.getItem(
      {
        Key: { Pk: { S: "latest" } },
        TableName: "metro"
      },
      async (err, data) => {
        if (err) throw err;
        // return that

        // if we have a rather old record, make a new one
        if (
          !data.Item ||
          Date.now() - new Date(+data.Item.Timestamp.S).getTime() > 300000
        ) {
          console.log("fetching new cache");
          var trainTimes = await fetchAllStops();
          var splits = deduplicateSplitsAndSort(trainTimesToSplits(trainTimes));
          res.json(splits);
          dynamo.putItem(
            {
              Item: {
                Pk: { S: "latest" },
                Timestamp: { S: Date.now().toString() },
                Splits: { S: JSON.stringify(splits) }
              },
              TableName: "metro"
            },
            err => (err ? console.log(err) : null)
          );
        } else if (data.Item && data.Item.Splits) {
          console.log("using cached data");
          res.json(JSON.parse(data.Item.Splits.S));
        } else {
          res.status(500);
          res.json([]);
        }
      }
    );
  } catch (e) {
    console.log("error getting splits", e);
    res.end([]);
    throw e;
  }
}

module.exports = handler;
