const express = require("express");
const usersRouter = express.Router();
const { sendUserById } = require("../controllers/users");
const { methodNotAllowed } = require("../errors");

usersRouter
  .route("/:username")
  .get(sendUserById)
  .all(methodNotAllowed);

module.exports = usersRouter;
