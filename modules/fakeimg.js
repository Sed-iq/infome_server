const mongoose = require("mongoose"),
  schema = mongoose.Schema({
    img: {
      type: String,
      required: true,
    },
  });

module.exports = mongoose.model("img", schema);
