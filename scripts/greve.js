const velo = require("../data/source/greve-velo.json");
const _ = require('lodash');
const fs = require('fs');
const path = require('path')

console.log(velo.features[0]);

const ids = {}

velo.features.forEach(feature => {
  if (ids[feature.properties.id]) {
    ids[feature.properties.id].properties.counts.push({date: feature.properties.date, count: feature.properties.counts})
  } else {
    ids[feature.properties.id] = {
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        counts: [{date: feature.properties.date, count: feature.properties.counts}],
        id: feature.properties.id
      }
    }
  }
});

let min = Infinity;
let max = 0;

Object.keys(ids).forEach(id => {
  // an array of counts in hours after 1572562800000
  ids[id].properties.counts = ids[id].properties.counts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(e => e.count);
  if (ids[id].properties.counts.length !== 2088) {
    delete ids[id];
  }
});

const fc = {
  type: 'FeatureCollection',
  features: Object.keys(ids).map(id => ids[id])
}

fs.writeFileSync(path.join(__dirname, '../data/derivative/comptes-velo.json'), JSON.stringify(fc))

const dailyCounts = 
  Object.keys(ids).map(id => _.chunk(ids[id].properties.counts, 24).map(_.sum)).reduce((a, b) => a.map((e, i) => (a[i] || 0 )+( b[i] || 0)))
  

console.log(dailyCounts.join('\n'));