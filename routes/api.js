const apiRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const topicsRouter = require("../routes/topics");
const usersRouter = require("../routes/users");
const commentsRouter = require("../routes/comments");
const articlesRouter = require("../routes/articles");
const { sendJson } = require("../controllers/api");

apiRouter
  .route("/")
  .get(sendJson)
  .all(methodNotAllowed);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
