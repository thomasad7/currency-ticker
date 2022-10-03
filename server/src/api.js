const { Router } = require("express");
const apiRouter = new Router();

const RatesService = require('./ratesservice');
const apiService = new RatesService();
apiService.initialise();

/* API routes should be specified here */
apiRouter.get("/healthz", (req, res) => {
  res.status(200).send("healthy");
});


/* Currency Rates routes */

apiRouter.get("/dates", (req, res) => {
  res.status(200).send(apiService.getDates());
});

apiRouter.get("/rates", (req, res) => {
  let date = req.query.date;
  if (date != null)
      res.status(200).send(apiService.getRates(date));
  else
      res.status(400).send("missing date parameter");
});


module.exports = apiRouter;
