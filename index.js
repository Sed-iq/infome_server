const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
// const Router = require("./modules/routes");
const upload = require("./modules/uploadController");
const imgsch = require("./modules/fakeimg");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");
const app = express();
let PORT =
  "mongodb+srv://Trustadmin:08126074692@cluster0.t9mbj.mongodb.net/TrustNg";
app.use(bodyParser({ extended: true }));
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// async function cloudinaryUploader(localfilepath) {
//   var mainFolderName = "main";

//   var filePathOnCloudinary = mainFolderName + "/" + localfilepath;

//   return cloudinary.uploader
//     .upload_stream({
//       folder:"test",
//     } , (err, result)=>{
//       if(err)
//         return err
//         else {
//           re
//         }
//     })
//     .catch((error) => {
//       // Remove file from local uploads folder
//       fs.unlinkSync(localfilepath);
//       return { message: "Fail" };
//     });
// }
function buildSuccessMsg(urlList) {
  return urlList;
}
app.get("/", ({}, res) => {
  res.send(
    `<h2>Upload File </h2> <form action="/file" enctype="multipart/form-data" method="POST"> <input type="file" name="file"> <br> <button>Upload</button> </form>`
  );
});
app.post("/file", upload.single("file"), async (req, res) => {
  let cld_uploader = cloudinary.uploader
    .upload_stream(
      {
        folder: "/test",
      },
      (err, result) => {
        if (err) res.json(err);
        else {
          res.json(result);
        }
      }
    )
    .end(req.file.buffer);
});
// let local = req.file.path;

// let result = await cloudinaryUploader(local);

// let response = buildSuccessMsg([result.url]);

// let Img = new imgsch({
//   img: response[0],
//   });
//   Img.save()
//     .then((data) => {
//       if (data) res.json(data);
//       else res.redirect("/");
//     })
//     .catch((err) => {
//       res.json(err);
//     });
// });
app.get("/pic/:file", ({ params }, res) => {});
mongoose
  .connect(PORT)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => console.log("Server running"));
  })
  .catch((err) => {
    console.log(err);
  });

// app.use(Router);
