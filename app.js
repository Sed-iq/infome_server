// const express = require("express");
// const mongoose = require("mongoose");
// // const Router = require("./modules/routes");
// const app = express();
// let PORT =
//   "mongodb+srv://Trustadmin:08126074692@cluster0.t9mbj.mongodb.net/TrustNg";

// app.get("/", ({}, res) => {
//   res.send("HOME PAGE");
// });

// mongoose
//   .connect(PORT)
//   .then(() => {
//     app.listen(process.env.PORT || 5000, () => console.log("Server running"));
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// app.use(Router);

let http = require("http");
let server = http.createServer((req, res) => {
  if ((req.url = "/")) res.end("<h1>Home Page</h1>");
  else res.end("404");
});
server.listen(5000, console.log("Server is running"));
