const mongoose = require("mongoose");

module.exports = (server, url) => {
  mongoose.connect(url, (err) => {
    if (!err) server.listen(process.env.PORT, console.log("SERVER IS RUNNING"));
    else {
      server.listen(
        process.env.PORT,
        console.error("Server running on safe mode database error \n")
      );
    }
  });
};
