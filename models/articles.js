const connection = require("../db/connection");

exports.fetchArticleById = article_id => {
  return connection
    .select("articles.*")
    .count({ comment_count: "title" })
    .from("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id")
    .then(articles => {
      return articles.map(article => {
        article.comment_count = +article.comment_count;
        return article;
      });
    });
};

exports.updateArticlePoints = (article_id, increment) => {
  return connection
    .select("articles.*")
    .count({ comment_count: "title" })
    .from("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id")
    .then(articles => {
      return articles.map(article => {
        article.votes += increment;
        article.comment_count = +article.comment_count;
        return article;
      });
    });
};

exports.insertComment = comment => {
  comment.author = comment.username;
  delete comment.username;
  return connection("comments")
    .insert(comment)
    .returning("*");
};

exports.fetchCommentsByArticle = article_id => {
  return connection("comments").where("article_id", article_id);
};
