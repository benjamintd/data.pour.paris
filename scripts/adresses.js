const fs = require('fs');
const path = require('path');

const file = fs.readFileSync(path.join(__dirname, '../data/source/adresse_paris.geojson'));
const data = JSON.parse(file);
const out = fs.createWriteStream(path.join(__dirname, '../data/derivative/adresse_paris.geojson'))
console.log(data.features.length)
data.features.forEach(f => out.write(JSON.stringify({
  type: 'Feature',
  geometry: f.geometry,
  properties: {
    n_voie: f.properties.n_voie
  }
}) + '\n'));

out.end();