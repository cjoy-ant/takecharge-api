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
  hcp_date_modified: provider.hcp_date_modified,
});

providersRouter
  .route("/")
  .get((req, res, next) => {
    const knex = req.app.get("db");
    ProvidersService.getAllProviders(knex)
      .then((providers) => {
        res.json(providers);
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

    ProvidersService.insertProvider(knex, newProvider)
      .then((provider) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${provider.hcp_id}`))
          .json(serializeProvider(provider));
      })
      .catch(next);
  });

providersRouter
  .route("/:provider_id")
  .all((req, res, next) => {
    const knex = req.app.get("db");
    ProvidersService.getById(knex, req.params.provider_id)
      .then((provider) => {
        if (!provider) {
          return res.status(404).json({
            error: { message: `Provider not found` },
          });
        }
        res.provider = provider;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json({
      hcp_id: res.provider.hcp_id,
      hcp_type: xss(res.provider.hcp_type),
      hcp_name: xss(res.provider.hcp_name),
      hcp_location: xss(res.provider.hcp_location),
      hcp_phone: xss(res.provider.hcp_phone),
      hcp_address_street: xss(res.provider.hcp_address_street),
      hcp_address_city: xss(res.provider.hcp_address_city),
      hcp_address_state: xss(res.provider.hcp_address_state),
      hcp_address_zip: xss(res.provider.hcp_address_zip),
      hcp_date_modified: res.provider.hcp_date_modified,
    });
  })
  .delete((req, res, next) => {
    const knex = req.app.get("db");
    ProvidersService.deleteProvider(knex, req.params.provider_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
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
    const providerToUpdate = {
      hcp_type,
      hcp_name,
      hcp_location,
      hcp_phone,
      hcp_address_street,
      hcp_address_city,
      hcp_address_state,
      hcp_address_zip,
    };

    const numberOfValues = Object.values(providerToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain the following: hcp_type,
          hcp_name,
          hcp_location,
          hcp_phone,
          hcp_address_street,
          hcp_address_city,
          hcp_address_state,
          hcp_address_zip,`,
        },
      });
    }

    const knex = req.app.get("db");
    ProvidersService.updateProvider(
      knex,
      req.params.provider_id,
      providerToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = providersRouter;
