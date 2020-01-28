const splits = require("../data/source/splits.json");
const fc = require("../src/api/marathon/fc.json");
const _ = require("lodash");
const fs = require("fs");

const splitsKm = [0, 5, 10, 15, 20, 25, 30, 35, 40, 42.4];

function getSpeed(split, km) {
  const i = _.sortedLastIndex(splitsKm, km);
  if (split[i - 1] && split[i]) {
    return (3600 * (splitsKm[i] - splitsKm[i - 1])) / (split[i] - split[i - 1]); // km/h
  } else return null;
}

function getTime(split, km) {
  const i = _.sortedLastIndex(splitsKm, km);
  if (split[i - 1] && split[i]) {
    const t = (km - splitsKm[i - 1]) / (splitsKm[i] - splitsKm[i - 1]);
    return t * (split[i] - split[i - 1]) + split[i - 1];
  } else return null;
}

function getTimeIndex(timestamp) {
  const startTimestamp = 1523168100;
  return Math.max(0, Math.round((timestamp - startTimestamp) / 60));
}

fc.features.forEach(f => {
  delete f.properties.speeds;
});

for (let i = 0; i < fc.features.length; i++) {
  let km = i / 20; // 20 points per km
  for (let j = 0; j < splits.length; j++) {
    let split = splits[j].splits;
    let speed = getSpeed(split, km);
    if (speed) {
      let index = getTimeIndex(getTime(split, km));

      for (let k = Math.max(0, index - 5); k < index + 5; k++) {
        if (!fc.features[i].properties.speeds) {
          fc.features[i].properties.speeds = [];
        }
        if (!fc.features[i].properties.speeds[k]) {
          fc.features[i].properties.speeds[k] = {
            speedSum: 0,
            speedCount: 0
          };
        }
        fc.features[i].properties.speeds[k].speedSum += speed;
        fc.features[i].properties.speeds[k].speedCount += 1;
      }
    }
  }
}

fc.features.forEach(f => {
  f.properties.speeds = f.properties.densities.map((e, i) => {
    if (!f.properties.speeds[i]) return 0;
    else
      return +(
        f.properties.speeds[i].speedSum / f.properties.speeds[i].speedCount
      ).toFixed(1);
  });
  console.log(
    f.properties.speeds.filter(e => e === 0).length,
    f.properties.speeds.length
  );
});

fs.writeFileSync("./src/api/marathon/fc.json", JSON.stringify(fc));
