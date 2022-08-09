const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  Router = require("./modules/routes");

app.use(Router);
mongoose
  .connect(
    "mongodb+srv://Trustadmin:08126074692@cluster0.t9mbj.mongodb.net/TrustNg"
  )
  .then(() => {
    app.listen(process.env.PORT, () => console.log("Server running"));
  })
  .catch((err) => console.log(err));
