const homeController = require("../controllers/home-controller");
const cors = require("cors");
const path = require("path");
const express = require("express");

module.exports = app => {
  //this means that we will only allow this specific origin to access the API
  const corsOptions = {
    origin: "http://localhost:8080"
  };
  app.get("/GetThreads", cors(corsOptions), homeController.getthreads);
  app.get("/GetImages", cors(corsOptions), homeController.getimages);
  app.use(express.static(path.join(__dirname, "../../website/dist/")));
  app.get("/", cors(corsOptions), function(req, res, next) {
    res.render("index.html");
  });
};
