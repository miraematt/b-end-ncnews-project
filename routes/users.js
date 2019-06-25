const express = require("express");
const usersRouter = express.Router();
const { sendUserById, sendAllUsers } = require("../controllers/users");
const { methodNotAllowed } = require("../errors");

usersRouter
  .route("/")
  .get(sendAllUsers)
  .all(methodNotAllowed);

usersRouter
  .route("/:username")
  .get(sendUserById)
  .all(methodNotAllowed);

module.exports = usersRouter;
