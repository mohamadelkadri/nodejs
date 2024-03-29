const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session"); //this package is to activate session after login
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comments");
const restoRoutes = require("./routes/resto/resto");
const globalErrHandler = require("./middlewares/globalHandler");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const Post = require("./models/post/Post");
const truncatePost = require("./utils/helpers");
dotenv.config(); //pour utiliser les données dans le fichier .env, il faut l'appeler au début. Librairie dotenv
require("./config/dbConnect");

const app = express();

// helpers
app.locals.truncatePost = truncatePost;

// middlewares
// configure ejs
app.set("view engine", "ejs");
// serve static files
app.use(express.static(__dirname, +"/public"));

app.use(express.json()); //to get the json from body
app.use(express.urlencoded({ extended: true })); //to get the data from website

// -------------------------------------
// middlewares--se the routes folder
// -------------------------------------

// methode override(post and put)
app.use(methodOverride("_method"));

// session configuration
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60, //date of expiration of session
    }),
  })
);

// save the login user into locals
app.use((req, res, next) => {
  if (req.session?.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});

// render home page
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    res.render("index", { posts });
  } catch (error) {
    res.render("index", { error: error.message });
  }
});

// -----------------------------
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/resto", restoRoutes);

// -------------------------------------
// routes
// -------------------------------------

// User route
// POST/api/v1/users/register
// app.post("/");

// POST/api/v1/users/login
// app.post("/api/v1/users/login", );

// GET/api/v1/users/:id
// app.get("/api/v1/users/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `User details ${req.params.id}`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// GET/api/v1/users/profile/:id
// app.get("/api/v1/users/profile/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `User profile ${req.params.id}`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// PUT/api/v1/users/profile-photo-upload/:id
// app.put("/api/v1/users/profile-photo-upload/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `photo uploaded ${req.params.id}`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// PUT/api/v1/users/cover-photo-upload/:id
// app.put("/api/v1/users/cover-photo-upload/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `cover uploaded ${req.params.id}`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// PUT/api/v1/users/update-password/:id
// app.put("/api/v1/users/update-password/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `password updated ${req.params.id}`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// GET/api/v1/users/logout
// app.get("/api/v1/users/logout", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `user logout`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// posts route

// POST/api/v1/posts
// app.post("/api/v1/posts", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `Post created`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// GET/api/v1/posts
// app.get("/api/v1/posts", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `Post list`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// GET/api/v1/posts/:id
// app.get("/api/v1/posts/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `Posts user ${req.params.id}`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// DELETE/api/v1/posts/:id
// app.delete("/api/v1/posts/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `Posts delete user ${req.params.id}`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// PUT/api/v1/posts/:id
// app.put("/api/v1/posts/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `Posts updated user ${req.params.id}`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// comments route
// POST/api/v1/comments
// app.post("/api/v1/comments", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `comments created`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// GET/api/v1/comments
// app.get("/api/v1/comments", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `comments list`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// GET/api/v1/comments/:id
// app.get("/api/v1/comments/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `comments user ${req.params.id}`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// DELETE/api/v1/comments/:id
// app.delete("/api/v1/comments/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `comment delete user ${req.params.id}`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// PUT/api/v1/comments/:id
// app.put("/api/v1/comments/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: `comment updated user ${req.params.id}`,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// });

// Error handling middlewares
app.use(globalErrHandler);

// listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`server is running on port ${PORT}`));
