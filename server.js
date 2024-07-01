const path = require("path");
const express = require("express");
const webpack = require("webpack");
const webpackMiddleware = require("webpack-dev-middleware");
const webpackConfig = require("./server-webpack.config");

const Amadeus = require("amadeus");

const amadeus = new Amadeus({
  clientId: "WHftJ9XBGGpjW4UQ56A7VxTP2ahvgLVP",
  clientSecret: "6XJ3GzTZ3F0GFHiA",
});

const app = express();
const publicPath = path.join(__dirname, "public");
const port = process.env.PORT || 9000;

app.use(express.static(publicPath));
app.use(webpackMiddleware(webpack(webpackConfig)));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.get("/flights", (req, res) => {
  console.log(req.query);
  const { from, to, date, adults } = req.query;

  if (!from || !to || !date || !adults) {
    res.status(400).json({ error: "Missing required parameters" });
    return;
  }

  if (adults < 1) {
    res.status(400).json({ error: "At least one adult is required" });
    return;
  }

  if (adults > 8) {
    res.status(400).json({ error: "Maximum of 8 adults allowed" });
    return;
  }

  if (from === to) {
    res.status(400).json({ error: "From and to locations cannot be the same" });
    return;
  }

  if (from.length < 3 || from.length > 4 || to.length < 3 || to.length > 4) {
    res
      .status(400)
      .json({ error: "Invalid from or to location, must be IATA code" });
    return;
  }

  amadeus.shopping.flightOffersSearch
    .get({
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate: date, //"2024-10-21",
      adults: adults,
    })
    .then(function (response) {
      res.json({ response: response.data });
      console.log("Amadeus:", response.data);
    })
    .catch(function (responseError) {
      console.log("Error", responseError.code);
    });
});
