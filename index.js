const express = require("express");
const mongoose = require("mongoose");
// const Router = require("./modules/routes");
const upload = require("./modules/uploadController");
const imgsch = require("./modules/fakeimg");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
let PORT =
  "mongodb+srv://Trustadmin:08126074692@cluster0.t9mbj.mongodb.net/TrustNg";
//"mongodb://localhost/blog";
app.use(bodyParser({ extended: true }));

app.get("/", ({}, res) => {
  res.send(
    `<h2>Upload File </h2> <form action="/file" enctype="multipart/form-data" method="POST"> <input type="file" name="file"> <br> <button>Upload</button> </form>`
  );
});
app.post("/file", upload.single("file"), (req, res) => {
  let Img = new imgsch({
    img: req.file.filename,
  });
  Img.save()
    .then((data) => {
      if (data) res.send(data);
      else res.redirect("/");
    })
    .catch((err) => {
      res.json(err);
    });
});
app.get("/pic/:file", ({ params }, res) => {
  imgsch
    .findOne({ img: params.file })
    .then((data) => {
      if (data) res.sendFile(path.join(__dirname + `/uploads/${data.img}`));
      else res.send(`404`);
    })
    .catch((err) => {
      res.json(err);
    });
});
mongoose
  .connect(PORT)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => console.log("Server running"));
  })
  .catch((err) => {
    console.log(err);
  });

// app.use(Router);
