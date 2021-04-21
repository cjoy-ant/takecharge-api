const path = require("path");
const express = require("express");
const xss = require("xss");
const ProvidersService = require("./providers-service");

const providersRouter = express.Router();
const jsonParser = express.json();

const serializeProvider = (provider) => ({
  hcp_id: provider.hcp_id,
  hcp_type: xss(provider.hcp_type),
  hcp_name: xss(provider.hcp_name),
  hcp_location: xss(provider.hcp_location),
  hcp_phone: xss(provider.hcp_phone),
  hcp_address_street: xss(provider.hcp_address_street),
  hcp_address_city: xss(provider.hcp_address_city),
  hcp_address_state: xss(provider.hcp_address_state),
  hcp_address_zip: xss(provider.hcp_address_zip),
});

providersRouter.route("/").get((req, res, next) => {
  const knex = req.app.get("db");
  ProvidersService.getAllProviders(knex)
    .then((providers) => {
      res.json(providers);
    })
    .catch(next);
});

module.exports = providersRouter;
