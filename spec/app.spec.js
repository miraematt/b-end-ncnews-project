process.env.NODE_ENV = "test";

const { expect } = require("chai");
const request = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

describe("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/api", () => {
    it("GET status:200", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    it("POST status:405 Method Not Allowed for all methods that we cannot use", () => {
      return request(app)
        .post("/api")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    describe("/topics", () => {
      it("GET status:200 it responds with an array of topics, each topic having the correct properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.contain.keys("slug", "description");
          });
      });
      it("POST status:405 Method Not Allowed for all methods that we cannot use", () => {
        return request(app)
          .post("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
    });
    describe("/users/:username", () => {
      it("GET status:200 it responds with a user object that has the correct properties", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.eql({
              username: "butter_bridge",
              name: "jonny",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
            });
          });
      });
      it("POST status:405 Method Not Allowed for all methods that we cannot use", () => {
        return request(app)
          .post("/api/users/butter_bridge")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("GET status:404 Not Found for username that does not exist", () => {
        return request(app)
          .get("/api/users/mattyboy")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("No user found for this username");
          });
      });
    });
    describe("/articles/:article_id", () => {
      it("GET status:200 it responds with an article object that has the correct properties including a comment_count", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: 13
            });
          });
      });
      it("POST status:405 Method Not Allowed for all methods that we cannot use", () => {
        return request(app)
          .post("/api/articles/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("GET status:404 Not Found for article_id that does not exist", () => {
        return request(app)
          .get("/api/articles/1234567890")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("No article found for this article id");
          });
      });
      it("GET status:400 Bad Request for article_id that is not a positive integer", () => {
        return request(app)
          .get("/api/articles/hello")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
    });

    describe("/articles/:article_id", () => {
      it("PATCH status:200 it responds with an article object that has the correct properties including an updated vote count when given an increment vote object as input", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 101,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: 13
            });
          });
      });
      it("PATCH status:200 it responds when given a negative increment vote object as input", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 99,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: 13
            });
          });
      });
      it("POST status:405 Method Not Allowed for all methods that we cannot use", () => {
        return request(app)
          .post("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("PATCH status:404 Not Found for article_id that does not exist", () => {
        return request(app)
          .patch("/api/articles/1234567890")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("No article found for this article id");
          });
      });
      it("PATCH status:404 Not Found for invalid increment", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "yes" })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Increment should be a number");
          });
      });
      it("PATCH status:400 Bad Request for article_id that is not a positive integer", () => {
        return request(app)
          .patch("/api/articles/hello")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
    });

    describe("/articles/:article_id", () => {
      describe.only("/comments", () => {
        it("POST status:200 it responds with a new comment object that has the correct properties and that corresponds to the username and body given", () => {
          return request(app)
            .post("/api/articles/1")
            .send({ username: "butter_bridge", body: "This is rubbish!" })
            .expect(200);
          // .then(({ body }) => {
          //   expect(body.article).to.eql({
          //     article_id: 1,
          //     title: "Living in the shadow of a great man",
          //     body: "I find this existence challenging",
          //     votes: 100,
          //     topic: "mitch",
          //     author: "butter_bridge",
          //     created_at: "2018-11-15T12:21:54.171Z",
          //     comment_count: 13
          //   });
          // });
        });
        // it("POST status:405 Method Not Allowed for all methods that we cannot use", () => {
        //   return request(app)
        //     .post("/api/articles/1")
        //     .expect(405)
        //     .then(({ body }) => {
        //       expect(body.msg).to.equal("Method Not Allowed");
        //     });
        // });
        // it("GET status:404 Not Found for article_id that does not exist", () => {
        //   return request(app)
        //     .get("/api/articles/1234567890")
        //     .expect(404)
        //     .then(({ body }) => {
        //       expect(body.msg).to.equal("No article found for this article id");
        //     });
        // });
        // it("GET status:400 Bad Request for article_id that is not a positive integer", () => {
        //   return request(app)
        //     .get("/api/articles/hello")
        //     .expect(400)
        //     .then(({ body }) => {
        //       expect(body.msg).to.equal("Bad Request");
        //     });
        // });
      });
    });
  });
});
