const mongoose = require("mongoose");

module.exports = (server, url) => {
  mongoose.connect(url, (err) => {
    if (!err) server.listen(process.env.PORT, console.log("SERVER IS RUNNING"));
    else {
     trow err
    }
  });
};
