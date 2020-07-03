const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const path = require("path");
var randomPointsOnPolygon = require("random-points-on-polygon");
const turf = require("@turf/turf");

const file = fs.readFileSync(
  path.join(__dirname, "../data/source/vote-counts.csv")
);
const referentiel = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../data/source/secteurs-des-bureaux-de-vote.geojson")
  )
);

const parcs = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/source/parcs.geojson"))
);

const water = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../data/source/plan-de-voirie-voies-deau.geojson")
  )
);

const records = parse(file, {
  columns: true,
  skip_empty_lines: true,
  delimiter: ",",
});

const refMap = new Map();

referentiel.features.forEach((f) => {
  for (const p of parcs.features) {
    f = turf.difference(f, p.properties.geom);
  }

  for (const w of water.features) {
    f = turf.difference(f, w);
  }
  refMap.set(f.properties["id_bv"], f);
});

const outStream = fs.createWriteStream(
  path.join(__dirname, "../data/derivative/votes.geojsonl")
);

const candidates = ["Buzyn", "Dati", "Hidalgo", "Villani", "Simonnet"];

records.forEach((r) => {
  const f = refMap.get(r["ID_BVOTE"]);
  if (!f) return;
  const totalVotes = candidates.reduce((total, c) => total + +r[c], 0);
  const points = randomPointsOnPolygon(totalVotes, f);
  let i = 0;
  for (let c = 0; c < candidates.length; c++) {
    for (let j = 0; j < +r[candidates[c]]; j++) {
      points[i].properties = { [candidates[c]]: 1 };
      outStream.write(JSON.stringify(points[i]) + "\n");
      i++;
    }
  }
});

outStream.end();
