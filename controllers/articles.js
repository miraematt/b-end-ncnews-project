const {
  fetchArticleById,
  updateArticlePoints,
  insertComment,
  fetchCommentsByArticle,
  fetchAllArticles,
  insertArticle,
  removeArticleById
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
  let increment = req.body.inc_votes;
  if (!req.body.inc_votes) increment = 0;
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
          status: 400,
          msg: "Bad Request - Increment should be a number"
        });
      }

      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postCommentOnArticle = (req, res, next) => {
  const { username, body } = req.body;
  if (!username || !body)
    res.status(400).send({ msg: "Username or comment is missing" });

  const { article_id } = req.params;
  insertComment({ username, body, article_id })
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.postNewArticle = (req, res, next) => {
  const { username, body, slug, title } = req.body;
  if (!title || !slug || !body)
    res.status(400).send({ msg: "Username or comment is missing" });
  insertArticle({ username, body, slug, title })
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.sendCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No article found for this article id"
        });
      }
      fetchCommentsByArticle(article_id, req.query)
        .then(comments => {
          comments.map(comment => delete comment.article_id);
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
    })
    .catch(next);
};

exports.sendAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      if (req.query.sort_by === "" || req.query.order === "") {
        return Promise.reject({
          status: 400,
          msg:
            "Sort property or order property have been chosen but invalid values have been given"
        });
      }
      if (articles.length === 0 && req.query.topic) {
        return Promise.reject({
          status: 404,
          msg: "There are no matches for this topic"
        });
      }
      if (articles.length === 0 && req.query.author) {
        return Promise.reject({
          status: 404,
          msg: "There are no matches for this author"
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

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id).then(deleteCount => {
    if (deleteCount === 1) res.sendStatus(204);
    else if (deleteCount === 0)
      return Promise.reject({ status: 404, msg: "Comment ID not found" });
  });
};
