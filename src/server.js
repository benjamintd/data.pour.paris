// As we're statically exporting the site, this
// server is mostly for development purposes.

import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";
polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sirv("src", { dev }), // to serve /api/ json files
    sapper.middleware()
  )
  .listen(PORT, err => {
    if (err) console.log("error", err);
  });
