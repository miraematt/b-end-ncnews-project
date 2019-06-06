const { fetchAllTopics } = require("../models/topics");

exports.sendAllTopics = (req, res, next) => {
  fetchAllTopics(req.body).then(topics => {
    res.status(200).send({ topics });
  });
};
