const fetch = require("node-fetch").default;

module.exports = async (req, res) => {
  try {
    return await fetch(
      "https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&rows=-1&facet=category&facet=tags&facet=address_zipcode&facet=address_city&facet=pmr&facet=blind&facet=deaf&facet=access_type&facet=price_type"
    )
      .then(r => r.json())
      .then(r => {
        const features = r.records.map((rec, i) => {
          // @todo add dates for filters
          const {
            id,
            cover,
            title,
            price_type,
            address_name,
            date_start,
            date_end,
            ...rest
          } = rec.fields;
          return {
            type: "Feature",
            id: i,
            properties: {
              id,
              cover,
              title,
              price_type,
              address_name,
              date_start,
              date_end
            },
            geometry: rec.geometry
          };
        });

        return res.status(200).json({ type: "FeatureCollection", features });
      });
  } catch (error) {
    return res.status(500).send();
  }
};
