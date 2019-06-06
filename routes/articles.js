const express = require("express");
const articlesRouter = express.Router();
const {
  sendArticleById,
  patchArticleById,
  postCommentOnArticle,
  sendCommentsByArticle
} = require("../controllers/articles");
const { methodNotAllowed } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticleById)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .get(sendCommentsByArticle)
  .post(postCommentOnArticle)
  .all(methodNotAllowed);

module.exports = articlesRouter;
