const path = require("path");

const multer = require("multer"),
  storage = multer.diskStorage({
    destination: (err, file, cb) => {
      cb(null, path.join(__dirname + "./../uploads"));
    },
    filename: (err, file, cb) => {
      cb(null, `${file.originalname}`);
    },
  });
module.exports = multer({ storage: storage });
