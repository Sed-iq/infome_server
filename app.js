const express = require("express");
const mongoose = require("mongoose");
// const Router = require("./modules/routes");
const Post = require("./modules/postSchema");
const app = express();
let PORT =
  "mongodb+srv://Trustadmin:08126074692@cluster0.t9mbj.mongodb.net/TrustNg";

mongoose
  .connect(PORT)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => console.log("Server running"));
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res) => {
  Post.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});
