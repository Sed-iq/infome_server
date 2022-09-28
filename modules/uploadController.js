const path = require("path");

const multer = require("multer");
const storage = multer.memoryStorage();
module.exports = multer({
  storage: storage,
  limits: {
    fieldSize: 5 * 1024 * 1024,
  },
});
