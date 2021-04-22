const path = require("path");
const express = require("express");
const xss = require("xss");
const RecommendationsService = require("./recommendations-service");

const recommendationsRouter = express.Router();
const jsonParser = express.json();

const serializeRecommendation = (rec) => ({
  recommendation_id: rec.recommendation_id,
  recommendation_type: xss(rec.recommendation_type),
  recommendation_notes: xss(rec.recommendation_notes),
  recommendation_date_modified: rec.recommendation_date_modified,
});

recommendationsRouter
  .route("/")
  .get((req, res, next) => {
    const knex = req.app.get("db");
    RecommendationsService.getAllRecommendations(knex)
      .then((recs) => {
        res.json(recs);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { recommendation_type, recommendation_notes } = req.body;
    const newRecommendation = { recommendation_type, recommendation_notes };
    const knex = req.app.get("db");

    for (const [key, value] of Object.entries(newRecommendation)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    RecommendationsService.insertRecommendation(knex, newRecommendation).then(
      (rec) => {
        res
          .status(201)
          .location(
            path.posix.join(req.originalUrl, `/${rec.recommendation_id}`)
          )
          .json(serializeRecommendation(rec));
      }
    );
  });

recommendationsRouter
  .route("/:rec_id")
  .all((req, res, next) => {
    const knex = req.app.get("db");
    RecommendationsService.getById(knex, req.params.rec_id)
      .then((rec) => {
        if (!rec) {
          return res.status(404).json({
            error: { message: `Recommendation not found` },
          });
        }
        res.rec = rec;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json({
      recommendation_id: res.rec.recommendation_id,
      recommendation_type: xss(res.rec.recommendation_type),
      recommendation_notes: xss(res.rec.recommendation_notes),
      recommendation_date_modified: res.rec.recommendation_date_modified,
    });
  })
  .delete((req, res, next) => {
    const knex = req.app.get("db");
    RecommendationsService.deleteRecommendation(knex, req.params.rec_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { recommendation_type, recommendation_notes } = req.body;
    const recommendationToUpdate = {
      recommendation_type,
      recommendation_notes,
    };

    const numberOfValues = Object.values(recommendationToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain the following:
          recommendation_type, recommendation_notes`,
        },
      });
    }

    const knex = req.app.get("db");
    RecommendationsService.updateRecommendation(
      knex,
      req.params.rec_id,
      recommendationToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = recommendationsRouter;
