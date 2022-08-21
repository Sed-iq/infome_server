/*
Original blog router code by Ikki Tenrio 17th july 2022, [Not original creation date]
*/
const express = require("express"),
  Router = express(),
  path = require("path"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  cookie = require("cookie-parser"),
  session = require("express-session"),
  upload = require("./uploadController"),
  { loginAuth, isLogin } = require("./auth"),
  post = require("./postSchema");
  fs = require("fs")
let oneDay = 1000 * 60 * 60 * 24;

Router.use(
  cors({
    origin: "https://blogctr.herokuapp.com",
    credentials: true,
  })
);
Router.use(bodyParser({ extendd: true }));
Router.use(
  session({
    secret: "session",
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: oneDay,
      httpOnly: true,
    },
  })
);
// Getting images
Router.use(cookie("supersecure"));
// image route
Router.get("/image/:id", (req, res) => {
  post
    .findById(req.params.id)
    .then((data) => {
      if (!data) res.status(404).end();
      else {
        if (req.query.q == "down") {
          res.sendFile(path.join(__dirname + `/../uploads/${data.image}`));
        } else {
          res.json(data.image);
        }
      }
    })
    .catch((err) => res.status(404).end());
});
function l(data) {
  console.log(data);
}

Router.get("/", async (req, res) => {
  if (req.query.q == "tpbg") {
    await post
      .find()
      .sort({ createdAt: "descending" })
      .limit(1)
      .then((data) => {
        res.sendFile(path.join(__dirname + "/../uploads/" + data[0].image));
      });
  } else if (req.query.q == "all") {
    await post
      .find()
      .sort({ createdAt: "descending" })
      .then((data) => {
        res.status(200).json({ data: data, isLogin: req.session.log });
      })
      .catch((err) => {
        res.status(404).end();
        console.log(err);
      });
  } else if (req.query.q == "side") {
    post
      .find()
      .sort({ views: "descending" })
      .limit(5)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => res.status(500).end());
  } else {
    let data;
    post
      .find()
      .limit(100)
      .sort({ createdAt: "descending" })
      .then((result) => {
        (data = result), res.json({ data: data, isLogin: req.session.log });
      });
  }
});
Router.delete("/delete/:id", isLogin, (req, res) => {
  post
    .findByIdAndDelete(req.params.id)
    .then((data) => {
    fs.unlink(path.join(__dirname + `/../uploads/${data.image}`), (err =>{
      if(err) console.log(err)
        else res.status(200).end()
    }))
    })
    .catch((err) => {
      res.status(404).end();
      console.log(err);
    });
});
var cookieSettings = {
  maxAge: oneDay,
  httpOnly: true,
};

Router.post("/like/:id", (req, res) => {
  if (req.params.id == undefined || req.params.id == "") {
    res.status(404).end();
  } else {
    if (req.cookies.like == undefined) {
      post
        .findById(req.params.id)
        .then((data) => {
          if (data) {
            post
              .findByIdAndUpdate(data._id, { likes: (data.likes += 1) })
              .then((ress) => {
                l("New like just came in");
                res.cookie("like", [req.params.id], cookieSettings);
                res.json({ like: true });
                res.end();
              })
              .catch((err) => l(err));
          } else {
            res.send("No such post");
          }
        })
        .catch((err) => console.log(Date.now.toDateString(), err));
    } else {
      // If like already exist on cookie
      let cookie = [...req.cookies.like];
      let newCookie = req.cookies.like.filter((c) => {
        return c == req.params.id;
      });
      if (newCookie == "") {
        // If the request sent is not in the cookie
        // When liking a new post with other post liked
        post
          .findById(req.params.id)
          .then((data) => {
            if (data != "") {
              post
                .findByIdAndUpdate(data._id, { likes: data.likes + 1 })
                .then((data) => {
                  if (data) {
                    cookie.push(req.params.id);
                    res.clearCookie("like");
                    res.cookie("like", cookie, cookieSettings);
                    res.json({ like: true });
                  } else {
                    l("Post not found");
                    res.status(404);
                  }
                  res.end();
                });
            }
          })
          .catch((err) => res.status(404).json());
      } else {
        // If the post has already been liked
        // Removing like from post
        newCookie = cookie.filter((c) => {
          return c != req.params.id;
        });
        post.findById(req.params.id).then((data) => {
          if (data) {
            post
              .findByIdAndUpdate(req.params.id, { likes: data.likes - 1 })
              .then((data) => {
                res.clearCookie("like");
                res.cookie("like", newCookie, cookieSettings);
                res.json({ like: false });
              });
          } else {
            l("Not found");
            res.status(404).send("Post Not found");
          }
        });
      }
    }
  }
});
Router.post("/login", loginAuth);
Router.put("/like/:id", (req, res) => {
  // check if already liked after refreshing page
  if (req.cookies.like == "" || req.cookies.like == undefined) {
    res.json({ like: false });
  } else {
    req.cookies.like.forEach((like) => {
      if (like == req.params.id) res.json({ like: true });
    });
  }
});
Router.get("/category/:name", (req, res) => {
  post
    .find({ category: req.params.name })
    .sort({ createdAt: "descending" })
    .then((data) => {
      if (data == null || data == "") {
        res.status(404).end();
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => res.status(404).json());
});

Router.post("/comment/:id", (req, res) => {
  const { name, comment, time } = req.body;
  post
    .findById(req.params.id)
    .then((data) => {
      if (data != null) {
        if (name == undefined || (name == "" && comment == undefined)) {
          console.log("Cannot comment");
          res.status(404).end();
        } else {
          let Comment = {
            comment: comment,
            name: name,
            time: time,
          };
          data.comments.push(Comment);
          post
            .findByIdAndUpdate(req.params.id, { comments: data.comments })
            .then(() => console.log("done"), res.json("done"))
            .catch((err) => console.error(err));
        }
      } else {
        console.log("hey");
        res.status(404).end();
      }
    })
    .catch((err) => res.status(500).end());
});
Router.get("/article/:id", async (req, res) => {
  await post.findOne({ _id: req.params.id }).then((data) => {
    if (data) {
      post.findByIdAndUpdate(data._id, { views: data.views + 1 })
      .then(result =>{
        res.json(result)
      })
      .catch(err =>{
        res.status(404).end()
      })

    } else {
      res.status(404).end();
    }
  });
 
});
// Adding a blog
Router.post("/post", isLogin, upload.single("image"), (req, res) => {
  const { body, title, snippet, category } = req.body,
    file = req.file.filename,
    Post = new post({
      title: title,
      body: body,
      snippet: snippet,
      image: file,
      category: category,
      likes: 0,
      views: 0,
      dislikes: 0,
    });
  Post.save()
    .then((data) => {
      res.status(200);
      res.end();
    })
    .catch((err) => {
      res.status(404);
    });
});
Router.get("/like/:id", (req, res) => {
  console.log(req.cookies.likeId);
  res.end();
});
module.exports = Router;
