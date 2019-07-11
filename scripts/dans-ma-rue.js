const fs = require('fs');
const path = require('path');

const file = fs.readFileSync(path.join(__dirname, '../data/source/dans-ma-rue.geojson'));
const data = JSON.parse(file);
const out = fs.createWriteStream(path.join(__dirname, '../data/derivative/dans-ma-rue.geojson'))

const props = new Set();
types = new Map();
data.features.forEach(f => {
  Object.keys(f.properties).forEach(p => props.add(p));
  const count = types.get(f.properties.soustype) || 0;
  types.set(f.properties.soustype, count + 1);
  out.write(JSON.stringify(f) + '\n')
});

console.log(Array.from(types).sort((a, b) => parseInt(b[1]) - parseInt(a[1])))
out.end();