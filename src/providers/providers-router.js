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

providersRouter
  .route("/")
  .get((req, res, next) => {
    const knex = req.app.get("db");
    ProvidersService.getAllProviders(knex)
      .then((providers) => {
        res.json(providers.map(serializeProvider))
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      hcp_type,
      hcp_name,
      hcp_location,
      hcp_phone,
      hcp_address_street,
      hcp_address_city,
      hcp_address_state,
      hcp_address_zip,
    } = req.body;
    const newProvider = {
      hcp_type,
      hcp_name,
      hcp_location,
      hcp_phone,
      hcp_address_street,
      hcp_address_city,
      hcp_address_state,
      hcp_address_zip,
    };
    const knex = req.app.get("db");

    for (const [key, value] of Object.entries(newProvider)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
  
    ProvidersService.insertProvider(knex, newProvider).then((provider) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${provider.hcp_id}`))
        .json(serializeProvider(provider));
    });
  });
module.exports = providersRouter;
