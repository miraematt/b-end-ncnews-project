const express = require("express");
const topicsRouter = express.Router();
const { sendAllTopics } = require("../controllers/topics");
const { methodNotAllowed } = require("../errors");

topicsRouter
  .route("/")
  .get(sendAllTopics)
  .all(methodNotAllowed);

module.exports = topicsRouter;
