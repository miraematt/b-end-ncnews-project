const express = require("express");
const articlesRouter = express.Router();
const {
  sendArticleById,
  patchArticleById,
  postCommentOnArticle,
  sendCommentsByArticle,
  sendAllArticles,
  postNewArticle,
  deleteArticleById
} = require("../controllers/articles");
const { methodNotAllowed } = require("../errors");

articlesRouter
  .route("/")
  .get(sendAllArticles)
  .post(postNewArticle)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .get(sendCommentsByArticle)
  .post(postCommentOnArticle)
  .all(methodNotAllowed);

module.exports = articlesRouter;
