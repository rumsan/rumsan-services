const express = require("express");
const cors = require("cors");
var routes = require("./src/controller");
const config = require("config");

const { MailService } = require("@rumsan/core/services");
MailService.setConfig(config.get("services.mail"));

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", routes);

app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  res.json(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    success: false,
    status: err.status || 500,
    message: err.message,
    error: err,
  });
});

module.exports = app;
