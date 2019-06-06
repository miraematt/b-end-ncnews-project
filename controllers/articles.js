const { fetchArticleById, updateArticlePoints } = require("../models/articles");

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
  res.status(200).send({ msg: "Hi there!" });

  // const increment = req.body.inc_votes;
  // const { article_id } = req.params;
  // updateArticlePoints(article_id, increment)
  //   .then(([article]) => {
  //     if (!article) {
  //       return Promise.reject({
  //         status: 404,
  //         msg: "No article found for this article id"
  //       });
  //     }
  //     if (typeof increment != "number" && increment) {
  //       return Promise.reject({
  //         status: 404,
  //         msg: "Increment should be a number"
  //       });
  //     }

  //     res.status(200).send({ article });
  //   })
  //   .catch(next);
};
