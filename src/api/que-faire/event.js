const fetch = require("node-fetch").default;

module.exports = async (req, res) => {
  try {
    return await fetch(
      `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&facet=category&facet=tags&facet=address_zipcode&facet=address_city&facet=pmr&facet=blind&facet=deaf&facet=access_type&facet=price_type&refine.id=${req.query.id}`
    )
      .then(r => r.json())
      .then(r => {
        const feature = r.records.map((rec, i) => ({
          type: "Feature",
          id: i,
          properties: { ...rec.fields },
          geometry: rec.geometry
        }))[0];

        return res.status(200).json(feature);
      });
  } catch (error) {
    return res.status(500).send();
  }
};
