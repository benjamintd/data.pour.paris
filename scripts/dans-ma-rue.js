const fs = require("fs");
const path = require("path");

const file = fs.readFileSync(
  path.join(__dirname, "../data/source/dans-ma-rue.geojson")
);
const data = JSON.parse(file);
const out = fs.createWriteStream(
  path.join(__dirname, "../data/derivative/dans-ma-rue.geojson")
);

types = {};
data.features.forEach(f => {
  if (!types[f.properties.type]) types[f.properties.type] = {};
  if (!types[f.properties.type][(f.properties.soustype || "").split(":")[0]])
    types[f.properties.type][(f.properties.soustype || "").split(":")[0]] = 0;
  types[f.properties.type][(f.properties.soustype || "").split(":")[0]] += 1;
});

console.log(JSON.stringify(types, null, 2));
