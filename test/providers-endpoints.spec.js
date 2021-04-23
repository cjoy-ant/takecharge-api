const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const {
  makeProvidersArray,
  makeMaliciousProvider,
  testIds,
} = require("./fixtures");

describe("/providers Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("takecharge_providers").truncate());

  afterEach("cleanup", () => db("takecharge_providers").truncate());

  describe("GET /api/providers", () => {
    context("Given no providers", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app).get(`/api/providers`).expect(200, []);
      });
    });

    context("Given there are providers in the database", () => {
      const testProviders = makeProvidersArray();

      beforeEach("insert test providers", () => {
        return db.into("takecharge_providers").insert(testProviders);
      });

      it("GET /api/providers responds with 200 and all of the providers", () => {
        return supertest(app).get(`/api/providers`).expect(200, testProviders);
      });
    });

    context("Given XSS attack content", () => {
      const testProviders = makeProvidersArray();
      const { maliciousProvider, expectedProvider } = makeMaliciousProvider();

      beforeEach("insert malicious provider", () => {
        return db
          .into("takecharge_providers")
          .insert(testProviders)
          .then(() => {
            return db.into("takecharge_providers").insert([maliciousProvider]);
          });
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/providers`)
          .expect(200)
          .expect((res) => {
            expect(res.body[res.body.length - 1].hcp_type).to.eql(
              expectedProvider.hcp_type
            );
          })
          .expect((res) => {
            expect(res.body[res.body.length - 1].hcp_name).to.eql(
              expectedProvider.hcp_name
            );
          })
          .expect((res) => {
            expect(res.body[res.body.length - 1].hcp_location).to.eql(
              expectedProvider.hcp_location
            );
          })
          .expect((res) => {
            expect(res.body[res.body.length - 1].hcp_phone).to.eql(
              expectedProvider.hcp_phone
            );
          })
          .expect((res) => {
            expect(res.body[res.body.length - 1].hcp_address_street).to.eql(
              expectedProvider.hcp_address_street
            );
          })
          .expect((res) => {
            expect(res.body[res.body.length - 1].hcp_address_city).to.eql(
              expectedProvider.hcp_address_city
            );
          })
          .expect((res) => {
            expect(res.body[res.body.length - 1].hcp_address_state).to.eql(
              expectedProvider.hcp_address_state
            );
          })
          .expect((res) => {
            expect(res.body[res.body.length - 1].hcp_address_zip).to.eql(
              expectedProvider.hcp_address_zip
            );
          });
      });
    });
  });

  describe("GET /api/providers/:provider_id", () => {
    context("Given no providers", () => {
      it("responds with 404", () => {
        const providerId = testIds.provider;
        return supertest(app)
          .get(`/api/providers/${providerId}`)
          .expect(404, { error: { message: `Provider not found` } });
      });
    });

    context("Given there are providers in the database", () => {
      const testProviders = makeProvidersArray();

      beforeEach("insert test providers", () => {
        return db.into("takecharge_providers").insert(testProviders);
      });

      it("responds with 200 and the specified provider", () => {
        const providerId = testProviders[1].hcp_id;
        const expectedProvider = testProviders[1];

        return supertest(app)
          .get(`/api/providers/${providerId}`)
          .expect(200, expectedProvider);
      });
    });

    context("Given XSS attack content", () => {
      const testProviders = makeProvidersArray();
      const { maliciousProvider, expectedProvider } = makeMaliciousProvider();

      beforeEach("insert malicious provider", () => {
        return db
          .into("takecharge_providers")
          .insert(testProviders)
          .then(() => {
            return db.into("takecharge_providers").insert([maliciousProvider]);
          });
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/providers/${maliciousProvider.hcp_id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.hcp_type).to.eql(expectedProvider.hcp_type);
          })
          .expect((res) => {
            expect(res.body.hcp_name).to.eql(expectedProvider.hcp_name);
          })
          .expect((res) => {
            expect(res.body.hcp_location).to.eql(expectedProvider.hcp_location);
          })
          .expect((res) => {
            expect(res.body.hcp_phone).to.eql(expectedProvider.hcp_phone);
          })
          .expect((res) => {
            expect(res.body.hcp_address_street).to.eql(
              expectedProvider.hcp_address_street
            );
          })
          .expect((res) => {
            expect(res.body.hcp_address_city).to.eql(
              expectedProvider.hcp_address_city
            );
          })
          .expect((res) => {
            expect(res.body.hcp_address_state).to.eql(
              expectedProvider.hcp_address_state
            );
          })
          .expect((res) => {
            expect(res.body.hcp_address_zip).to.eql(
              expectedProvider.hcp_address_zip
            );
          });
      });
    });
  });

  describe("POST /api/providers/", () => {
    const testProviders = makeProvidersArray();

    beforeEach("insert test providers", () => {
      return db.into("takecharge_providers").insert(testProviders);
    });

    it("creates a provider, responding with 201 and the new provider", () => {
      const newProvider = {
        hcp_type: "Test Specialty",
        hcp_name: "Dr. Test",
        hcp_location: "Test Hospital",
        hcp_phone: "123-456-7890",
        hcp_address_street: "1234 Test St.",
        hcp_address_city: "Test City",
        hcp_address_state: "AL",
        hcp_address_zip: "123456",
      };

      return supertest(app)
        .post(`/api/providers`)
        .send(newProvider)
        .expect(201)
        .expect((res) => {
          expect(res.body.hcp_type).to.eql(newProvider.hcp_type);
          expect(res.body.hcp_name).to.eql(newProvider.hcp_name);
          expect(res.body.hcp_location).to.eql(newProvider.hcp_location);
          expect(res.body.hcp_phone).to.eql(newProvider.hcp_phone);
          expect(res.body.hcp_address_street).to.eql(
            newProvider.hcp_address_street
          );
          expect(res.body.hcp_address_city).to.eql(
            newProvider.hcp_address_city
          );
          expect(res.body.hcp_address_state).to.eql(
            newProvider.hcp_address_state
          );
          expect(res.body.hcp_address_zip).to.eql(newProvider.hcp_address_zip);
          expect(res.body).to.have.property("hcp_id");
          expect(res.headers.location).to.eql(
            `/api/providers/${res.body.hcp_id}`
          );
          const expected = new Date().toLocaleDateString();
          const actual = new Date(
            res.body.hcp_date_modified
          ).toLocaleDateString();
          expect(actual).to.eql(expected);
        })
        .then((postRes) =>
          supertest(app)
            .get(`/api/providers/${postRes.body.hcp_id}`)
            .expect(postRes.body)
        );
    });

    // validation testing
    const requiredFields = [
      "hcp_type",
      "hcp_name",
      "hcp_location",
      "hcp_phone",
      "hcp_address_street",
      "hcp_address_city",
      "hcp_address_zip",
    ];

    requiredFields.forEach((field) => {
      const newProvider = {
        hcp_type: "Test Specialty",
        hcp_name: "Dr. Test",
        hcp_location: "Test Hospital",
        hcp_phone: "123-456-7890",
        hcp_address_street: "1234 Test St.",
        hcp_address_city: "Test City",
        hcp_address_state: "AL",
        hcp_address_zip: "123456",
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newProvider[field];

        return supertest(app)
          .post(`/api/providers`)
          .send(newProvider)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });

    it("removes XSS attack content", () => {
      const { maliciousProvider, expectedProvider } = makeMaliciousProvider();
      return supertest(app)
        .post(`/api/providers`)
        .send(maliciousProvider)
        .expect(201)
        .expect((res) => {
          expect(res.body.hcp_type).to.eql(expectedProvider.hcp_type);
        })
        .expect((res) => {
          expect(res.body.hcp_name).to.eql(expectedProvider.hcp_name);
        })
        .expect((res) => {
          expect(res.body.hcp_location).to.eql(expectedProvider.hcp_location);
        })
        .expect((res) => {
          expect(res.body.hcp_phone).to.eql(expectedProvider.hcp_phone);
        })
        .expect((res) => {
          expect(res.body.hcp_address_street).to.eql(
            expectedProvider.hcp_address_street
          );
        })
        .expect((res) => {
          expect(res.body.hcp_address_city).to.eql(
            expectedProvider.hcp_address_city
          );
        })
        .expect((res) => {
          expect(res.body.hcp_address_state).to.eql(
            expectedProvider.hcp_address_state
          );
        })
        .expect((res) => {
          expect(res.body.hcp_address_zip).to.eql(
            expectedProvider.hcp_address_zip
          );
        });
    });
  });

  describe("DELETE /api/providers/:provider_id", () => {
    context("Given no providers", () => {
      it("responds with 404", () => {
        const providerId = testIds.provider;
        return supertest(app)
          .delete(`/api/providers/${providerId}`)
          .expect(404, { error: { message: `Provider not found` } });
      });
    });

    context("Given there are providers in the database", () => {
      const testProviders = makeProvidersArray();

      beforeEach("insert test providers", () => {
        return db.into("takecharge_providers").insert(testProviders);
      });

      it("responds with 204 and removes the note", () => {
        const idToRemove = testProviders[1].hcp_id; // test provider 2
        const expectedProviders = testProviders.filter(
          (provider) => provider.hcp_id !== idToRemove
        );

        return supertest(app)
          .delete(`/api/providers/${idToRemove}`)
          .expect(204)
          .then((res) => {
            supertest(app).get(`/api/providers`).expect(expectedProviders);
          });
      });
    });
  });

  describe.only("PATCH /api/providers/:provider_id", () => {
    context("Given no providers", () => {
      it("responds with 404", () => {
        const providerId = testIds.provider;
        return supertest(app)
          .patch(`/api/providers/${providerId}`)
          .expect(404, { error: { message: `Provider not found` } });
      });
    });

    context("Given there are providers in the database", () => {
      const testProviders = makeProvidersArray();

      beforeEach("insert test providers", () => {
        return db.into("takecharge_providers").insert(testProviders);
      });

      it("responds with 204 and updates the provider", () => {
        const idToUpdate = testProviders[1].hcp_id; // test provider 2
        const updateProvider = {
          hcp_type: "Updated Specialty",
          hcp_name: "Dr. Update",
          hcp_location: "Updated Hospital",
          hcp_phone: "123-456-7890",
          hcp_address_street: "1234 Update St.",
          hcp_address_city: "Update City",
          hcp_address_state: "AL",
          hcp_address_zip: "123456",
        };

        const expectedProvider = {
          ...testProviders[1],
          ...updateProvider,
        };

        return supertest(app)
          .patch(`/api/providers/${idToUpdate}`)
          .send(updateProvider)
          .expect(204)
          .then((res) => {
            supertest(app)
              .get(`/api/providers/${idToUpdate}`)
              .expect(expectedProvider);
          });
      });
    });
  });
});
