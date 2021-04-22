const path = require("path");
const express = require("express");
const xss = require("xss");
const VisitsService = require("./visits-service");

const visitsRouter = express.Router();
const jsonParser = express.json();

const serializeVisit = (visit) => ({
  visit_id: visit.visit_id,
  visit_type: xss(visit.visit_type),
  visit_provider_name: xss(visit.visit_provider_name),
  visit_location: xss(visit.visit_location),
  visit_date: xss(visit.visit_date),
  visit_reason: xss(visit.visit_reason),
  visit_notes: xss(visit.visit_notes),
  visit_date_modified: visit.visit_date_modified,
});

visitsRouter
  .route("/")
  .get((req, res, next) => {
    const knex = req.app.get("db");
    VisitsService.getAllVisits(knex)
      .then((visits) => {
        res.json(visits.map(serializeVisit));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      visit_type,
      visit_provider_name,
      visit_location,
      visit_date,
      visit_reason,
      visit_notes,
    } = req.body;
    const newVisit = {
      visit_type,
      visit_provider_name,
      visit_location,
      visit_date,
      visit_reason,
      visit_notes,
    };
    const knex = req.app.get("db");

    for (const [key, value] of Object.entries(newVisit)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    VisitsService.insertVisit(knex, newVisit).then((visit) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${visit.visit_id}`))
        .json(serializeVisit(visit));
    });
  });

visitsRouter
  .route("/:visit_id")
  .all((req, res, next) => {
    const knex = req.app.get("db");
    VisitsService.getById(knex, req.params.visit_id)
      .then((visit) => {
        if (!visit) {
          return res.status(404).json({
            error: { message: `Visit not found` },
          });
        }
        res.visit = visit;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json({
      visit_id: res.visit.visit_id,
      visit_type: xss(res.visit.visit_type),
      visit_provider_name: xss(res.visit.visit_provider_name),
      visit_location: xss(res.visit.visit_location),
      visit_date: xss(res.visit.visit_date),
      visit_reason: xss(res.visit.visit_reason),
      visit_notes: xss(res.visit.visit_notes),
      visit_date_modified: res.visit.visit_date_modified,
    });
  })
  .delete((req, res, next) => {
    const knex = req.app.get("db");
    VisitsService.deleteVisit(knex, req.params.visit_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      visit_type,
      visit_provider_name,
      visit_location,
      visit_date,
      visit_reason,
      visit_notes,
    } = req.body;
    const visitToUpdate = {
      visit_type,
      visit_provider_name,
      visit_location,
      visit_date,
      visit_reason,
      visit_notes,
    };

    const numberOfValues = Object.values(visitToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain the following:
          visit_type,
          visit_provider_name,
          visit_location,
          visit_date,
          visit_reason,
          visit_notes`,
        },
      });
    }

    const knex = req.app.get("db");
    VisitsService.updateVisit(knex, req.params.visit_id, visitToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = visitsRouter;
