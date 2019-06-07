const { updateCommentVotes, removeCommentById } = require("../models/comments");

exports.patchCommentById = (req, res, next) => {
  const increment = req.body.inc_votes;
  const { comments } = req.params;
  updateCommentVotes(comments, increment)
    .then(([comment]) => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "No comment found for this comment id"
        });
      }
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comments } = req.params;
  removeCommentById(comments).then(deleteCount => {
    if (deleteCount === 1) res.sendStatus(204);
    else if (deleteCount === 0)
      return Promise.reject({ status: 404, msg: "Comment ID not found" });
  });
};
