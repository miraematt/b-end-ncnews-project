const connection = require("../db/connection");

exports.updateCommentVotes = (comment_id, increment) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .increment("votes", increment)
    .returning("*");
};

exports.removeCommentById = comment => {
  console.log(comment);
  return connection("comments")
    .where("comment_id", comment)
    .del();
};
