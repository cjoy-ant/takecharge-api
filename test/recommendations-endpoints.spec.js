const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const {
  makeRecommendationsArray,
  makeMaliciousRecommendation,
  testIds,
} = require("./fixtures");

describe("/recommendations Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("takecharge_recommendations").truncate());

  afterEach("cleanup", () => db("takecharge_recommendations").truncate());

  describe("GET /api/recommendations", () => {
    context("Given no recommendations", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app).get(`/api/recommendations`).expect(200, []);
      });
    });

    context("Given there are recommendations in the database", () => {
      const testRecommendations = makeRecommendationsArray();

      beforeEach("insert test recommendations", () => {
        return db
          .into("takecharge_recommendations")
          .insert(testRecommendations);
      });

      it("GET /api/recommendations responds with 200 and all of the recommendations", () => {
        return supertest(app)
          .get(`/api/recommendations`)
          .expect(200, testRecommendations);
      });
    });

    context("Given XSS attack content", () => {
      const testRecommendations = makeRecommendationsArray();
      const {
        maliciousRecommendation,
        expectedRecommendation,
      } = makeMaliciousRecommendation();

      beforeEach("insert malicious recommendation", () => {
        return db
          .into("takecharge_recommendations")
          .insert(testRecommendations)
          .then(() => {
            return db
              .into("takecharge_recommendations")
              .insert([maliciousRecommendation]);
          });
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/recommendations`)
          .expect(200)
          .expect((res) => {
            expect(res.body[res.body.length - 1].recommendation_type).to.eql(
              expectedRecommendation.recommendation_type
            );
          })
          .expect((res) => {
            expect(res.body[res.body.length - 1].recommendation_notes).to.eql(
              expectedRecommendation.recommendation_notes
            );
          });
      });
    });
  });

  describe("GET /api/recommendations/:rec_id", () => {
    context("Given no recommendations", () => {
      it("responds with 404", () => {
        const recommendationId = testIds.recommendation;
        return supertest(app)
          .get(`/api/recommendations/${recommendationId}`)
          .expect(404, { error: { message: `Recommendation not found` } });
      });
    });

    context("Given there are recommendations in the database", () => {
      const testRecommendations = makeRecommendationsArray();

      beforeEach("insert test recommendations", () => {
        return db
          .into("takecharge_recommendations")
          .insert(testRecommendations);
      });

      it("responds with 200 and the specified recommendation", () => {
        const recommendationId = testRecommendations[1].recommendation_id;
        const expectedRecommendation = testRecommendations[1];

        return supertest(app)
          .get(`/api/recommendations/${recommendationId}`)
          .expect(200, expectedRecommendation);
      });
    });

    context("Given XSS attack content", () => {
      const testRecommendations = makeRecommendationsArray();
      const {
        maliciousRecommendation,
        expectedRecommendation,
      } = makeMaliciousRecommendation();

      beforeEach("insert malicious recommendation", () => {
        return db
          .into("takecharge_recommendations")
          .insert(testRecommendations)
          .then(() => {
            return db
              .into("takecharge_recommendations")
              .insert([maliciousRecommendation]);
          });
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(
            `/api/recommendations/${maliciousRecommendation.recommendation_id}`
          )
          .expect(200)
          .expect((res) => {
            expect(res.body.recommendation_type).to.eql(
              expectedRecommendation.recommendation_type
            );
          })
          .expect((res) => {
            expect(res.body.recommendation_notes).to.eql(
              expectedRecommendation.recommendation_notes
            );
          });
      });
    });
  });

  describe("POST /api/recommendations", () => {
    const testRecommendations = makeRecommendationsArray();

    beforeEach("insert test recommendations", () => {
      return db.into("takecharge_recommendations").insert(testRecommendations);
    });

    it("creates a recommendation, responding with 201 and the new recommendation", () => {
      const newRecommendation = {
        recommendation_type: "Test Specialty",
        recommendation_notes: "test recommendation notes",
      };

      return supertest(app)
        .post(`/api/recommendations`)
        .send(newRecommendation)
        .expect(201)
        .expect((res) => {
          expect(res.body.recommendation_type).to.eql(
            newRecommendation.recommendation_type
          );
          expect(res.body.recommendation_notes).to.eql(
            newRecommendation.recommendation_notes
          );
          expect(res.body).to.have.property("recommendation_id");
          expect(res.headers.location).to.eql(
            `/api/recommendations/${res.body.recommendation_id}`
          );
          const expected = new Date().toLocaleDateString();
          const actual = new Date(
            res.body.recommendation_date_modified
          ).toLocaleDateString();
          expect(actual).to.eql(expected);
        })
        .then((postRes) =>
          supertest(app)
            .get(`/api/recommendations/${postRes.body.recommendation_id}`)
            .expect(postRes.body)
        );
    });

    // validation testing
    const requiredFields = ["recommendation_type", "recommendation_notes"];

    requiredFields.forEach((field) => {
      const newRecommendation = {
        recommendation_type: "Test Specialty",
        recommendation_notes: "test recommendation notes",
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newRecommendation[field];

        return supertest(app)
          .post(`/api/recommendations`)
          .send(newRecommendation)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });

    it("removes XSS attack content", () => {
      const {
        maliciousRecommendation,
        expectedRecommendation,
      } = makeMaliciousRecommendation();
      return supertest(app)
        .post(`/api/recommendations`)
        .send(maliciousRecommendation)
        .expect(201)
        .expect((res) => {
          expect(res.body.recommendation_type).to.eql(
            expectedRecommendation.recommendation_type
          );
        })
        .expect((res) => {
          expect(res.body.recommendation_notes).to.eql(
            expectedRecommendation.recommendation_notes
          );
        });
    });
  });

  describe("DELETE /api/recommendations/:rec_id", () => {
    context("Given no recommendations", () => {
      it("responds with 404", () => {
        const recommendationId = testIds.recommendation;
        return supertest(app)
          .delete(`/api/recommendations/${recommendationId}`)
          .expect(404, { error: { message: `Recommendation not found` } });
      });
    });

    context("Given there are recommendations in the database", () => {
      const testRecommendations = makeRecommendationsArray();

      beforeEach("insert test recommendations", () => {
        return db
          .into("takecharge_recommendations")
          .insert(testRecommendations);
      });

      it("responds with 204 and removes the note", () => {
        const idToRemove = testRecommendations[1].recommendation_id; // test recommendation 2
        const expectedRecommendations = testRecommendations.filter(
          (recommendation) => recommendation.recommendation_id !== idToRemove
        );

        return supertest(app)
          .delete(`/api/recommendations/${idToRemove}`)
          .expect(204)
          .then((res) => {
            supertest(app)
              .get(`/api/recommendations`)
              .expect(expectedRecommendations);
          });
      });
    });
  });

  describe("PATCH /api/recommendations/:rec_id", () => {
    context("Given no recommendations", () => {
      it("responds with 404", () => {
        const recommendationId = testIds.recommendation;
        return supertest(app)
          .patch(`/api/recommendations/${recommendationId}`)
          .expect(404, { error: { message: `Recommendation not found` } });
      });
    });

    context("Given there are recommendations in the database", () => {
      const testRecommendations = makeRecommendationsArray();

      beforeEach("insert test recommendations", () => {
        return db
          .into("takecharge_recommendations")
          .insert(testRecommendations);
      });

      it("responds with 204 and updates the recommendation", () => {
        const idToUpdate = testRecommendations[1].recommendation_id; // test recommendation 2
        const updateRecommendation = {
          recommendation_type: "Updated Specialty",
          recommendation_notes: "Updated recommendation notes",
        };

        const expectedRecommendation = {
          ...testRecommendations[1],
          ...updateRecommendation,
        };

        return supertest(app)
          .patch(`/api/recommendations/${idToUpdate}`)
          .send(updateRecommendation)
          .expect(204)
          .then((res) => {
            supertest(app)
              .get(`/api/recommendations/${idToUpdate}`)
              .expect(expectedRecommendation);
          });
      });
    });
  });
});
