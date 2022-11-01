const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const Router = require("./modules/routes");
const bodyParser = require("body-parser") 
const PORT = process.env.URI
app.use(bodyParser({ extended: true }));

mongoose
  .connect(PORT)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => console.log("Server running"));
  })
  .catch((err) => {
    console.log(err);
  });

app.use(Router)
