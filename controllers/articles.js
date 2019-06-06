const {
  fetchArticleById,
  updateArticlePoints,
  insertComment,
  fetchCommentsByArticle
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

  exports.sendCommmentsByArticle = (req, res, next) => {
    console.log("Whdzup!");
    res.status(200).send({ msg: "Hello there!!!" });
    const { article_id } = req.params;
    fetchCommentsByArticle(article_id)
      .then(comments => {
        // if (!user) {
        //   return Promise.reject({
        //     status: 404,
        //     msg: "No user found for this username"
        //   });
        // }
        // res.status(200).send({ comments });
      })
      .catch(next);
  };
};
