process.env.NODE_ENV = "test";

const { expect } = require("chai");
const request = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

describe("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe.only("/api", () => {
    it("GET status:200", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    describe("/topics", () => {
      it("GET status:200 it responds with an array of topics, each topic having the correct properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.ok).to.equal(true);
          });
      });
    });
  });
});

// .then(({ body }) => {
//   expect(body.treasures).to.be.an("array");
//   expect(body.treasures[0]).to.contain.keys(
//     "treasure_id",
//     "treasure_name",
//     "colour",
//     "age",
//     "cost_at_auction",
//     "shop_name"
//   );
// });
