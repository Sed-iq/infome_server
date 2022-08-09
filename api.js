const express = require("express");
const mongoose = require("mongoose");
const app = express();
let PORT =
  "mongodb+srv://Trustadmin:08126074692@cluster0.t9mbj.mongodb.net/TrustNg";

app.use((req, res) => {
  res.json({ name: "sediq" });
});

mongoose
  .connect(PORT)
  .then(() => {
    app.listen(process.env.PORT, () => console.log("Server running"));
  })
  .catch((err) => {
    console.log(err);
  });
