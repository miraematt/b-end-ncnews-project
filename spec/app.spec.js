process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = require("chai");

const chaiSorted = require("chai-sorted");
const request = require("supertest");
chai.use(chaiSorted);

const app = require("../app");
const connection = require("../db/connection");

describe("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/api", () => {
    it("GET status:200 returns a JSON representation of all the available endpoints of the api", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.contain.keys(
            "GET /api",
            "GET /api/topics",
            "GET /api/articles",
            "GET /api/users/:username",
            "GET /api/articles/:article_id",
            "PATCH /api/articles/:article_id",
            "POST /api/articles/:article_id/comments",
            "GET /api/articles/:article_id/comments",
            "PATCH /api/comments/:comment_id",
            "DELETE /api/comments/:comment_id"
          );
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
    // more testing required for user endpoint queries
    describe("/users", () => {
      it("GET status:200 it responds with an array of users, each user having the correct properties", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body.users).to.be.an("array");
            expect(body.users[0]).to.contain.keys(
              "name",
              "avatar_url",
              "username"
            );
          });
      });
      it("POST status:405 Method Not Allowed for all methods that we cannot use", () => {
        return request(app)
          .post("/api/users")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
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
              created_at: "2018-11-15T12:21:54.171Z"
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
              created_at: "2018-11-15T12:21:54.171Z"
            });
          });
      });
      it("PATCH status:200 it responds with the article when given a patch request with no body", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z"
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
      it("PATCH status:400 Bad Request for invalid increment", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "yes" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
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
      describe("/comments - POST", () => {
        it("POST status:201 it responds with a new comment object that has the correct properties and that corresponds to the username and body given", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "butter_bridge", body: "This is rubbish!" })
            .expect(201)
            .then(({ body }) => {
              const { created_at, ...restOfComments } = body.comment;
              expect(restOfComments).to.eql({
                comment_id: 19,
                author: "butter_bridge",
                article_id: 1,
                votes: 0,
                body: "This is rubbish!"
              });
            });
        });
        it("POST status:400 Bad Request for article_id that does not exist", () => {
          return request(app)
            .post("/api/articles/1234567890/comments")
            .send({ username: "butter_bridge", body: "This is rubbish!" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        });
        it("POST status:400 Bad Request for article_id that is not an integer", () => {
          return request(app)
            .post("/api/articles/hello/comments")
            .send({ username: "butter_bridge", body: "This is rubbish!" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        });
        it("POST status:400 Bad Request for request body that doesn't include the correct keys", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "butter_bridge" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Username or comment is missing");
            });
        });
        it("PATCH status:405 Method Not Allowed for all methods that we cannot use", () => {
          return request(app)
            .patch("/api/articles/1/comments")
            .send({ username: "butter_bridge", body: "This is rubbish!" })
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method Not Allowed");
            });
        });
      });
      describe("/comments - GET", () => {
        it("GET status:200 it responds with an array of comments for the given article_id", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.an("array");
              expect(body.comments[0]).to.contain.keys(
                "comment_id",
                "author",
                "votes",
                "created_at",
                "body"
              );
              expect(body.comments[0]).to.not.contain.keys("article_id");
            });
        });
        it("PATCH status:405 Method Not Allowed for all methods that we cannot use", () => {
          return request(app)
            .patch("/api/articles/1/comments")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method Not Allowed");
            });
        });

        it("GET status:404 Not Found for article_id that does not exist", () => {
          return request(app)
            .get("/api/articles/1234567890/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("No article found for this article id");
            });
        });
        it("GET status:200 Returns an empty array for an article with no comments", () => {
          return request(app)
            .get("/api/articles/7/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.eql([]);
            });
        });
        it("GET status:400 Bad Request for article_id that is not a positive integer", () => {
          return request(app)
            .get("/api/articles/hello/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        });
        it("GET status 200 comments are sorted in descending created order by default", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("created_at");
            });
        });
        it("GET status 200 comments are sorted by any column when passed a valid column as a url sort_by query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("votes");
            });
        });
        it("GET status 200 comments are sorted by any column when passed a valid column as a url sort_by query and an order query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes&order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.ascendingBy("votes");
            });
        });
        it("GET status:400 Bad Request for sort_by query that is not a valid column", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=recommendations")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        });
        it("GET status:400 Bad Request for sort_by query that is empty", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "Sort property or order property have been chosen but invalid values have been given"
              );
            });
        });
        it("GET status:400 Bad Request for sort_by query that is empty", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes&order=")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "Sort property or order property have been chosen but invalid values have been given"
              );
            });
        });
        it("GET status:400 Bad Request for order query that is invalid", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes&order=hello")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "Sort property or order property have been chosen but invalid values have been given"
              );
            });
        });
      });
    });
    describe("/articles", () => {
      it("GET status:200 it responds with an array of articles, each article having the correct properties", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an("array");
            expect(body.articles[0]).to.contain.keys(
              "article_id",
              "title",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            );
            expect(body.articles[0]).to.not.contain.keys("body");
          });
      });
      it("POST status:405 Method Not Allowed for all methods that we cannot use", () => {
        return request(app)
          .post("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("GET status 200 articles are sorted in descending created order by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("created_at");
          });
      });

      it("GET status 200 comments are sorted by any column when passed a valid column as a url sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("votes");
          });
      });
      it("GET status 200 comments are sorted by any column when passed a valid column as a url sort_by query and an order query", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.ascendingBy("votes");
          });
      });
      it("GET status:400 Bad Request for sort_by query that is not a valid column", () => {
        return request(app)
          .get("/api/articles?sort_by=recommendations")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("GET status:400 Bad Request for sort_by query that is empty", () => {
        return request(app)
          .get("/api/articles?sort_by=")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Sort property or order property have been chosen but invalid values have been given"
            );
          });
      });
      it("GET status:400 Bad Request for order query that is empty", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Sort property or order property have been chosen but invalid values have been given"
            );
          });
      });
      it("GET status:400 Bad Request for order query that is invalid", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=hello")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Sort property or order property have been chosen but invalid values have been given"
            );
          });
      });
      it("GET status:200 filters the results when given an author username as a query", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body }) => {
            const articlesArray = body.articles;
            let count = 0;
            for (let i = 0; i < articlesArray.length; i++) {
              if (articlesArray[i].author === "butter_bridge") {
                count++;
              }
            }
            expect(body.articles.length).to.equal(count);
          });
      });
      it("GET status:200 filters the results when given a topic value as a query", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body }) => {
            const articlesArray = body.articles;
            let count = 0;
            for (let i = 0; i < articlesArray.length; i++) {
              if (articlesArray[i].topic === "cats") {
                count++;
              }
            }
            expect(body.articles.length).to.equal(count);
            // need to do tests for filtering
          });
      });
      it("GET status:404 Not Found for topic that does not exist", () => {
        return request(app)
          .get("/api/articles?topic=notATopic")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("There are no matches for this topic");
          });
      });
      it("GET status:404 Not Found for author that does not exist", () => {
        return request(app)
          .get("/api/articles?author=notAnAuthor")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("There are no matches for this author");
          });
      });
    });

    describe("/comments/:comment_id", () => {
      it("PATCH status:200 it responds with a comment object that has the correct properties including an updated vote count when given an increment vote object as input", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).to.eql({
              article_id: 9,
              comment_id: 1,
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 17,
              author: "butter_bridge",
              created_at: "2017-11-22T12:36:03.389Z"
            });
          });
      });
      it("PATCH status:200 it responds when given a negative increment vote object as input", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).to.eql({
              article_id: 9,
              comment_id: 1,
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 15,
              author: "butter_bridge",
              created_at: "2017-11-22T12:36:03.389Z"
            });
          });
      });
      it("POST status:405 Method Not Allowed for all methods that we cannot use", () => {
        return request(app)
          .post("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("PATCH status:404 Not Found for comment_id that does not exist", () => {
        return request(app)
          .patch("/api/comments/1234567890")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("No comment found for this comment id");
          });
      });
      it("PATCH status:400 Bad Request for invalid increment", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "yes" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
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
    describe("/comments/:comment_id", () => {
      it("DELETE status:204 it deletes the requested house", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });

      it("POST status:405 Method Not Allowed for all methods that we cannot use", () => {
        return request(app)
          .post("/api/comments/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
    });
  });
});
