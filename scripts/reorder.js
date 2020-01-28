const cheapRuler = require("cheap-ruler");
const fs = require("fs");
const fc = require("../src/api/marathon/fc.json");
const route = require("../src/api/marathon/route.json");

const ruler = cheapRuler(48.8534, "meters");

fc.features = fc.features.sort((a, b) => {
  const pola = ruler.pointOnLine(
    route.geometry.coordinates,
    a.geometry.coordinates
  );
  const polb = ruler.pointOnLine(
    route.geometry.coordinates,
    b.geometry.coordinates
  );

  if (
    pola.index > polb.index ||
    (pola.index == polb.index && pola.t > polb.t)
  ) {
    return 1;
  } else {
    return -1;
  }
});

fs.writeFileSync("fc.json", JSON.stringify(fc));
console.log(JSON.stringify(fc.features[0].geometry));
