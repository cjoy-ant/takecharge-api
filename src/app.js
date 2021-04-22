require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { NODE_ENV, CLIENT_ORIGIN } = require("./config");
const errorHandler = require("./error-handler");
const providersRouter = require("./providers/providers-router");
const recommendationsRouter = require("./recommendations/recommendations-router");
const visitsRouter = require("./visits/visits-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

app.use("/api/providers", providersRouter);
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/visits", visitsRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(errorHandler);

module.exports = app;
