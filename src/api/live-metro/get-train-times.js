// TODO rewrite in Typescript, now natively supported by @now/node I think

"use strict";

const stops = require("./stops.json");
const fetch = require("node-fetch").default;
const _ = require("lodash");

const validStops = stops.features
  .map(s => s.properties.id_ref_zde.toString())
  .filter(e => !!e);

async function fetchStop(stop) {
  const baseUrl =
    "https://api-lab-trone-stif.opendata.stif.info/service/tr-unitaire-stif/stop-monitoring";
  const fullUrl =
    baseUrl +
    `?apikey=${
      process.env.STIF_API_KEY
    }&MonitoringRef=STIF%3AStopPoint%3AQ%3A${stop}%3A`;
  try {
    const res = await fetch(fullUrl);
    const result = await res.json();

    let visits = _.get(
      result,
      "Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit"
    );
    let soonestVisits = {};

    visits.forEach(v => {
      let visit = {
        lineRef: _.get(v, "MonitoredVehicleJourney.LineRef.value", "").split(
          ":"
        )[3],
        destination: _.get(
          v,
          "MonitoredVehicleJourney.DestinationRef.value",
          ""
        ).split(":")[3],
        currentStop: stop,
        expectedDepartureTime: _.get(
          v,
          "MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime"
        )
      };
      let destination = visit.destination;
      if (!visit.expectedDepartureTime) return;
      if (
        !soonestVisits[destination] ||
        new Date(soonestVisits[destination].expectedDepartureTime) >
          new Date(visit.expectedDepartureTime)
      ) {
        soonestVisits[destination] = visit;
      }
    });

    return Object.values(soonestVisits);
  } catch (e) {
    console.log("error fetching the STIF data for", stop, e);
    return [];
  }
}

module.exports = async function fetchAllStops() {
  try {
    const visits = await Promise.all(validStops.map(fetchStop));
    return _.flatten(visits);
  } catch (e) {
    console.log("error fetching all stops", e);
  }
};
