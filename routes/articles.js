const express = require("express");
const articlesRouter = express.Router();
const {
  sendArticleById,
  patchArticleById,
  postCommentOnArticle
} = require("../controllers/articles");
const { methodNotAllowed } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(patchArticleById)
  .post(postCommentOnArticle)
  .all(methodNotAllowed);

module.exports = articlesRouter;
