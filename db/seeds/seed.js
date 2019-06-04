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
// const { ownerData, shopData, treasureData } = require("../data/index");
// const {
//   createOwnerRef,
//   createShopRef,
//   formatShops,
//   formatTreasures
// } = require("../../utils/index");

// js
//  db/seeds/index.js
// const { houseData, wizardData } = require('../data');

// exports.seed = function(knex, Promise) {
//   return knex.migrate
//     .rollback()
//     .then(() => knex.migrate.latest())
//     .then(() => {
//       return knex('houses')
//         .insert(houseData)
//         .returning('*');
//     })
//     .then((houseRows) => {
//       /<-- do the rest of the seed logic here ...
//     });
// };

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
