const express = require("express");
const apiRouter = require("./routes/api");
const cors = require("cors");
const {
  routeNotFound,
  handle500,
  handleCustomErrors,
  badRequest,
  handlePsqlErrors
} = require("./errors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(badRequest);
app.use(handle500);
app.all("/*", routeNotFound);

module.exports = app;
