const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const path = require("path");

const file = fs.readFileSync(
  path.join(__dirname, "../data/source/comptages-routiers-permanents.csv")
);
const referentiel = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      "../data/source/referentiel-comptages-routiers.geojson"
    )
  )
);
const records = parse(file, {
  columns: true,
  skip_empty_lines: true,
  delimiter: ";"
});

const refMap = new Map();

referentiel.features.forEach(f => {
  refMap.set(f.properties["iu_ac"], f);
});

const startTime = new Date("2019-06-01T00:00:00+02:00");

records.forEach(r => {
  const f = refMap.get(parseInt(r["iu_ac"]));
  if (!f) return;

  if (!f.properties.q) {
    f.properties = {
      q: [],
      k: [],
      iu_ac: f.properties["iu_ac"]
    };
  }

  let offset = parseInt((new Date(r["t_1h"]) - startTime) / 1000 / 60 / 60);
  f.properties.q[offset] = +r.q;
  f.properties.k[offset] = +r.k;
  r = null;
});

console.log(referentiel.features.length);
referentiel.features = referentiel.features.map(f => {
  if (
    f &&
    f.properties &&
    f.properties.q &&
    f.properties.q.length === 720 &&
    f.properties.k.length === 720 &&
    (Math.max(...f.properties.q) > 0 || Math.max(...f.properties.k) > 0)
  ) {
    return f;
  } else {
    delete f.properties.q;
    delete f.properties.k;
    return f;
  }
});

console.log(referentiel.features.length);

fs.writeFileSync(
  path.join(__dirname, "../data/derivative/trafic.geojson"),
  JSON.stringify(referentiel)
);
