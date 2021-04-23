const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { makeVisitsArray, makeMaliciousVisit, testIds } = require("./fixtures");

describe.only("/visits Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("takecharge_visits").truncate());

  afterEach("cleanup", () => db("takecharge_visits").truncate());

  describe("GET /api/visits", () => {
    context("Given no visits", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app).get(`/api/visits`).expect(200, []);
      });
    });

    context("Given there are visits in the database", () => {
      const testVisits = makeVisitsArray();

      beforeEach("insert test visits", () => {
        return db.into("takecharge_visits").insert(testVisits);
      });

      it("GET /api/visits responds with 200 and all of the visits", () => {
        return supertest(app).get(`/api/visits`).expect(200, testVisits);
      });
    });

    context("Given XSS attack content", () => {
      const testVisits = makeVisitsArray();
      const { maliciousVisit, expectedVisit } = makeMaliciousVisit();

      beforeEach("insert malicious visit", () => {
        return db
          .into("takecharge_visits")
          .insert(testVisits)
          .then(() => {
            return db.into("takecharge_visits").insert([maliciousVisit]);
          });
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/visits`)
          .expect(200)
          .expect((res) => {
            expect(res.body[res.body.length - 1].visit_type).to.eql(
              expectedVisit.visit_type
            );
          })
          .expect((res) => {
            expect(res.body[res.body.length - 1].visit_notes).to.eql(
              expectedVisit.visit_notes
            );
          });
      });
    });
  });

  describe("GET /api/visits/:visit_id", () => {
    context("Given no visits", () => {
      it("responds with 404", () => {
        const visitId = testIds.visit;
        return supertest(app)
          .get(`/api/visits/${visitId}`)
          .expect(404, { error: { message: `Visit not found` } });
      });
    });

    context("Given there are visits in the database", () => {
      const testVisits = makeVisitsArray();

      beforeEach("insert test visits", () => {
        return db.into("takecharge_visits").insert(testVisits);
      });

      it("responds with 200 and the specified visit", () => {
        const visitId = testVisits[1].visit_id;
        const expectedVisit = testVisits[1];

        return supertest(app)
          .get(`/api/visits/${visitId}`)
          .expect(200, expectedVisit);
      });
    });

    context("Given XSS attack content", () => {
      const testVisits = makeVisitsArray();
      const { maliciousVisit, expectedVisit } = makeMaliciousVisit();

      beforeEach("insert malicious visit", () => {
        return db
          .into("takecharge_visits")
          .insert(testVisits)
          .then(() => {
            return db.into("takecharge_visits").insert([maliciousVisit]);
          });
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/visits/${maliciousVisit.visit_id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.visit_type).to.eql(expectedVisit.visit_type);
          })
          .expect((res) => {
            expect(res.body.visit_provider_name).to.eql(
              expectedVisit.visit_provider_name
            );
          })
          .expect((res) => {
            expect(res.body.visit_location).to.eql(
              expectedVisit.visit_location
            );
          })
          .expect((res) => {
            expect(res.body.visit_date.toLocaleString()).to.eql(
              expectedVisit.visit_date.toLocaleString()
            );
          })
          .expect((res) => {
            expect(res.body.visit_reason).to.eql(expectedVisit.visit_reason);
          })
          .expect((res) => {
            expect(res.body.visit_notes).to.eql(expectedVisit.visit_notes);
          });
      });
    });
  });

  describe("POST /api/visits", () => {
    const testVisits = makeVisitsArray();

    beforeEach("insert test visits", () => {
      return db.into("takecharge_visits").insert(testVisits);
    });

    it("creates a visit, responding with 201 and the new visit", () => {
      const newVisit = {
        visit_type: "Test Specialty",
        visit_provider_name: "Dr. Test",
        visit_location: "Test Visit Location",
        visit_date: "2021-05-21T16:24:02.922Z",
        visit_reason: "Test visit reason",
        visit_notes: "Test visit notes",
      };

      return supertest(app)
        .post(`/api/visits`)
        .send(newVisit)
        .expect(201)
        .expect((res) => {
          expect(res.body.visit_type).to.eql(newVisit.visit_type);
          expect(res.body.visit_provider_name).to.eql(
            newVisit.visit_provider_name
          );
          expect(res.body.visit_location).to.eql(newVisit.visit_location);
          expect(res.body.visit_date.toLocaleString()).to.eql(
            newVisit.visit_date.toLocaleString()
          );
          expect(res.body.visit_reason).to.eql(newVisit.visit_reason);
          expect(res.body.visit_notes).to.eql(newVisit.visit_notes);
          expect(res.body).to.have.property("visit_id");
          expect(res.headers.location).to.eql(
            `/api/visits/${res.body.visit_id}`
          );
          const expected = new Date().toLocaleDateString();
          const actual = new Date(
            res.body.visit_date_modified
          ).toLocaleDateString();
          expect(actual).to.eql(expected);
        })
        .then((postRes) =>
          supertest(app)
            .get(`/api/visits/${postRes.body.visit_id}`)
            .expect(postRes.body)
        );
    });

    // validation testing
    const requiredFields = ["visit_type", "visit_notes"];

    requiredFields.forEach((field) => {
      const newVisit = {
        visit_type: "Test Specialty",
        visit_provider_name: "Dr. Test",
        visit_location: "Test Visit Location",
        visit_date: "2021-05-21T16:24:02.922Z",
        visit_reason: "Test visit reason",
        visit_notes: "Test visit notes",
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newVisit[field];

        return supertest(app)
          .post(`/api/visits`)
          .send(newVisit)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });

    it("removes XSS attack content", () => {
      const { maliciousVisit, expectedVisit } = makeMaliciousVisit();
      return supertest(app)
        .post(`/api/visits`)
        .send(maliciousVisit)
        .expect(201)
        .expect((res) => {
          expect(res.body.visit_type).to.eql(expectedVisit.visit_type);
        })
        .expect((res) => {
          expect(res.body.visit_provider_name).to.eql(
            expectedVisit.visit_provider_name
          );
        })
        .expect((res) => {
          expect(res.body.visit_location).to.eql(expectedVisit.visit_location);
        })
        .expect((res) => {
          expect(res.body.visit_date).to.eql(expectedVisit.visit_date);
        })
        .expect((res) => {
          expect(res.body.visit_reason).to.eql(expectedVisit.visit_reason);
        })
        .expect((res) => {
          expect(res.body.visit_notes).to.eql(expectedVisit.visit_notes);
        });
    });
  });

  describe("DELETE /api/visits/:visit_id", () => {
    context("Given no visits", () => {
      it("responds with 404", () => {
        const visitId = testIds.visit;
        return supertest(app)
          .delete(`/api/visits/${visitId}`)
          .expect(404, { error: { message: `Visit not found` } });
      });
    });

    context("Given there are visits in the database", () => {
      const testVisits = makeVisitsArray();

      beforeEach("insert test visits", () => {
        return db.into("takecharge_visits").insert(testVisits);
      });

      it("responds with 204 and removes the note", () => {
        const idToRemove = testVisits[1].visit_id; // test visit 2
        const expectedVisits = testVisits.filter(
          (visit) => visit.visit_id !== idToRemove
        );

        return supertest(app)
          .delete(`/api/visits/${idToRemove}`)
          .expect(204)
          .then((res) => {
            supertest(app).get(`/api/visits`).expect(expectedVisits);
          });
      });
    });
  });

  describe("PATCH /api/visits/:visit_id", () => {
    context("Given no visits", () => {
      it("responds with 404", () => {
        const visitId = testIds.visit;
        return supertest(app)
          .patch(`/api/visits/${visitId}`)
          .expect(404, { error: { message: `Visit not found` } });
      });
    });

    context("Given there are visits in the database", () => {
      const testVisits = makeVisitsArray();

      beforeEach("insert test visits", () => {
        return db.into("takecharge_visits").insert(testVisits);
      });

      it("responds with 204 and updates the visit", () => {
        const idToUpdate = testVisits[1].visit_id; // test visit 2
        const updateVisit = {
          visit_type: "Updated Specialty",
          visit_provider_name: "Dr. Update",
          visit_location: "Updated Visit Location",
          visit_date: "2021-05-21T16:24:02.922Z",
          visit_reason: "Updated visit reason",
          visit_notes: "Updated visit notes",
        };

        const expectedVisit = {
          ...testVisits[1],
          ...updateVisit,
        };

        return supertest(app)
          .patch(`/api/visits/${idToUpdate}`)
          .send(updateVisit)
          .expect(204)
          .then((res) => {
            supertest(app)
              .get(`/api/visits/${idToUpdate}`)
              .expect(expectedVisit);
          });
      });
    });
  });
});
