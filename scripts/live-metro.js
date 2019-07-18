// This file is just here as a reference
// The original data is not included in the repository
// but can be found here https://opendata.stif.info/explore/dataset/traces-du-reseau-ferre-idf/

"use strict";
const cheapRuler = require("cheap-ruler");
const tb = require("@mapbox/tilebelt");
const fs = require("fs");
const path = require("path");

// main

const lineColors = fs
  .readFileSync(path.join(__dirname, "../data/line-colors.csv"))
  .toString()
  .split("\n")
  .filter(l => !!l)
  .map(l => l.split(",").map(s => s.replace(/(^\s+|\s+$)/g, "")));
const lines = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../data/traces-du-reseau-ferre-idf.geojson")
  )
);
const stops = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../data/emplacement-des-gares-idf.geojson")
  )
);

const ruler = cheapRuler(48.86727, "meters");

const preGraph = {};
const linesHash = {};
const stopsHash = {};
const lineColorsHash = {};
const idrefligaToIdrefligc = {};
lineColors.forEach(l => (lineColorsHash[l[0]] = "#" + l[1]));

lines.features.forEach((line, i) => {
  agrementLine(line, lineColorsHash, idrefligaToIdrefligc, i);
  let revline = reverse(line);
  addLineToGraph(preGraph, line, linesHash);
  addLineToGraph(preGraph, revline, linesHash);
});

stops.features.forEach((stop, i) => {
  agrementStop(stop, lineColorsHash, idrefligaToIdrefligc, i);
  addStopToGraph(preGraph, stop, stopsHash);
});

addNeighbors(preGraph, linesHash, stopsHash);

const graph = preGraphToGraph(preGraph, linesHash, stopsHash);

fs.writeFileSync(
  path.join(__dirname, "../data/lines.json"),
  JSON.stringify({
    type: "FeatureCollection",
    features: Object.keys(linesHash).map(l => linesHash[l])
  })
);

fs.writeFileSync(
  path.join(__dirname, "../data/stops.json"),
  JSON.stringify({
    type: "FeatureCollection",
    features: Object.keys(stopsHash).map(s => stopsHash[s])
  })
);

removeUselessProperties(linesHash);

fs.writeFileSync(
  path.join(__dirname, "../data/linesHash.json"),
  JSON.stringify(linesHash)
);
fs.writeFileSync(
  path.join(__dirname, "../data/stopsHash.json"),
  JSON.stringify(stopsHash)
);
fs.writeFileSync(
  path.join(__dirname, "../data/pre-graph.json"),
  JSON.stringify(preGraph)
);
fs.writeFileSync(
  path.join(__dirname, "../data/graph.json"),
  JSON.stringify(graph, null, 2)
);

// functions and utilities

function agrementLine(line, lineColorsHash, idrefligaToIdrefligc, index) {
  line.geometry.coordinates = line.geometry.coordinates.map(a => [
    Number(a[0]),
    Number(a[1])
  ]);
  if (lineColorsHash[line.properties.res_com])
    line.properties.color = lineColorsHash[line.properties.res_com];
  // also add the color to the idrefliga in the hash so that we can use it for stops
  lineColorsHash[line.properties.idrefliga] = line.properties.color;
  idrefligaToIdrefligc[line.properties.idrefliga] = line.properties.idrefligc;
  line.properties.graphId = `l:${line.properties.idrefliga}:${index}`;
  line.properties.startKey =
    tb.tileToQuadkey(
      tb.pointToTile(
        line.geometry.coordinates[0][0],
        line.geometry.coordinates[0][1],
        22
      )
    ) +
    ":" +
    line.properties.idrefligc;
  line.properties.endKey =
    tb.tileToQuadkey(
      tb.pointToTile(
        line.geometry.coordinates[line.geometry.coordinates.length - 1][0],
        line.geometry.coordinates[line.geometry.coordinates.length - 1][1],
        22
      )
    ) +
    ":" +
    line.properties.idrefligc;

  line.properties.distance = ruler.lineDistance(line.geometry.coordinates);
}

function addLineToGraph(preGraph, line) {
  if (!preGraph[line.properties.startKey])
    preGraph[line.properties.startKey] = { start: [], end: [] };
  if (!preGraph[line.properties.endKey])
    preGraph[line.properties.endKey] = { start: [], end: [] };

  preGraph[line.properties.startKey].start.push(line.properties.graphId);
  preGraph[line.properties.endKey].end.push(line.properties.graphId);

  linesHash[line.properties.graphId] = line;
}

function reverse(line) {
  let rev = {
    type: "Feature",
    properties: JSON.parse(JSON.stringify(line.properties)),
    geometry: {
      type: "LineString",
      coordinates: line.geometry.coordinates.slice().reverse()
    }
  };

  rev.properties.graphId += ":r";
  rev.properties.startKey = line.properties.endKey;
  rev.properties.endKey = line.properties.startKey;
  return rev;
}

function agrementStop(stop, lineColorsHash, idrefligaToIdrefligc, index) {
  if (!stop.properties.idrefliga) return;
  if (lineColorsHash[stop.properties.idrefliga])
    stop.properties.color = lineColorsHash[stop.properties.idrefliga];
  stop.properties.graphId = `s:${stop.properties.idrefliga}:${index}`;
  stop.properties.idrefligc = idrefligaToIdrefligc[stop.properties.idrefliga];
  stop.properties.key =
    tb.tileToQuadkey(
      tb.pointToTile(
        stop.geometry.coordinates[0],
        stop.geometry.coordinates[1],
        22
      )
    ) +
    ":" +
    stop.properties.idrefligc;
}

function addStopToGraph(preGraph, stop, stopsHash) {
  if (!stop.properties.key) return;
  if (!preGraph[stop.properties.key])
    preGraph[stop.properties.key] = { start: [], end: [] };
  if (preGraph[stop.properties.key].stop) {
    console.log("double stop at key", stop.properties.key);
    throw new Error("unexpected double stop");
  }
  preGraph[stop.properties.key].stop = stop.properties.graphId;
  stopsHash[stop.properties.graphId] = stop;
}

function addNeighbors(preGraph, linesHash, stopsHash) {
  Object.keys(preGraph).forEach(k => {
    let objs = preGraph[k];
    objs.start.forEach(s => {
      linesHash[s].properties.previous = objs.end;
      linesHash[s].properties.startStations = objs.stops;
    });
    objs.end.forEach(e => {
      linesHash[e].properties.next = objs.start;
      linesHash[e].properties.endStations = objs.stops;
    });

    if (objs.stop)
      stopsHash[objs.stop].properties.lines = objs.start.concat(objs.end);
  });
}

function preGraphToGraph(preGraph, linesHash, stopsHash) {
  // turns a quadkey: {start, end, stop} preGraph into a graph stopId: [{distance, lineId, nextStopId}]
  const graph = {};
  Object.keys(preGraph).forEach(key => {
    if (preGraph[key].stop) {
      let stop = stopsHash[preGraph[key].stop];
      let idrefligc = stop.properties.idrefligc;
      let idrefzde = stop.properties.id_ref_zde;
      if (!graph[idrefligc]) graph[idrefligc] = {};

      let paths = preGraph[key].start.slice().map(l => [l]);
      let finalPaths = [];

      while (paths.length > 0) {
        for (let i = 0, n = paths.length; i < n; i++) {
          let path = paths.shift();
          let lastLine = linesHash[path[path.length - 1]];
          let endKey = lastLine.properties.endKey;
          // if we're going back
          if (
            endKey === key ||
            (path.length >= 2 &&
              path[path.length - 2].split(":")[2] ===
                path[path.length - 1].split(":")[2])
          ) {
            continue;
          } else if (preGraph[endKey].stop) {
            let nextStop = stopsHash[
              preGraph[endKey].stop
            ].properties.id_ref_zde.toString();
            finalPaths.push({ lines: path, nextStop });
          } else {
            preGraph[endKey].start.forEach(l => {
              paths.push(path.concat([l]));
            });
          }
        }
      }

      graph[idrefligc][idrefzde] = finalPaths;
    }
  });
  return graph;
}

function removeUselessProperties(linesHash) {
  Object.keys(linesHash).forEach(k => {
    let line = linesHash[k];

    line.properties = {
      distance: line.properties.distance,
      color: line.properties.color,
      idrefligc: line.properties.idrefligc,
      graphId: line.properties.graphId,
      reseau: line.properties.reseau
    };
  });
  return linesHash;
}
