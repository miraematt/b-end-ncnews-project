const {
  fetchArticleById,
  updateArticlePoints,
  insertComment,
  fetchCommentsByArticle,
  fetchAllArticles
} = require("../models/articles");

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "No article found for this article id"
        });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const increment = req.body.inc_votes;
  const { article_id } = req.params;
  updateArticlePoints(article_id, increment)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "No article found for this article id"
        });
      }
      if (typeof increment != "number" && increment) {
        return Promise.reject({
          status: 404,
          msg: "Increment should be a number"
        });
      }

      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postCommentOnArticle = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;

  insertComment({ username, body, article_id })
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.sendCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticle(article_id, req.query)
    .then(comments => {
      comments.map(comment => delete comment.article_id);
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comments found for this article id"
        });
      }
      if (req.query.sort_by === "" || req.query.order === "") {
        return Promise.reject({
          status: 400,
          msg:
            "Sort property or order property have been chosen but invalid values have been given"
        });
      }
      const orderValues = ["asc", "desc"];
      if (req.query.order) {
        if (!orderValues.includes(req.query.order)) {
          return Promise.reject({
            status: 400,
            msg:
              "Sort property or order property have been chosen but invalid values have been given"
          });
        }
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.sendAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      // if (!article) {
      //   return Promise.reject({
      //     status: 404,
      //     msg: "No article found for this article id"
      //   });
      // }
      if (req.query.sort_by === "" || req.query.order === "") {
        return Promise.reject({
          status: 400,
          msg:
            "Sort property or order property have been chosen but invalid values have been given"
        });
      }
      const orderValues = ["asc", "desc"];
      if (req.query.order) {
        if (!orderValues.includes(req.query.order)) {
          return Promise.reject({
            status: 400,
            msg:
              "Sort property or order property have been chosen but invalid values have been given"
          });
        }
      }
      res.status(200).send({ articles });
    })
    .catch(next);
};
