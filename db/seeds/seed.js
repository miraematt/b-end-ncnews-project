const {
  articlesData,
  commentsData,
  topicsData,
  usersData
} = require("../data/index");
const {
  formatTimestampedData,
  createArticleRef,
  formatComments
} = require("../../utils/index");

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("topics")
        .insert(topicsData)
        .returning("*");
    })
    .then(() => {
      return knex("users")
        .insert(usersData)
        .returning("*");
    })
    .then(() => {
      const formattedArticles = formatTimestampedData(articlesData);
      return knex("articles")
        .insert(formattedArticles)
        .returning("*");
    })
    .then(articleRows => {
      const articleIdRef = createArticleRef(articleRows);
      const formattedComments = formatComments(commentsData, articleIdRef);
      return knex("comments")
        .insert(formattedComments)
        .returning("*");
    });
};
