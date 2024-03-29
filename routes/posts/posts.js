const express = require("express");
const multer = require("multer");
const protected = require("../../middlewares/protected");
const {
  createPostCtrl,
  fetchPostsCtrl,
  deletePostCtrl,
  fetchPostCtrl,
  updatePostCtrl,
} = require("../../controllers/posts/posts");
const storage = require("../../config/cloudinary");
const Post = require("../../models/post/Post");
const postRoutes = express.Router();

// instance of multer
const upload = multer({ storage });

// GET new post form
postRoutes.get("/create-post", (req, res) => {
  res.render("posts/addPost.ejs", { error: "" });
});

// POST/api/v1/posts
postRoutes.post("/", protected, upload.single("file"), createPostCtrl);

// GET/api/v1/posts
postRoutes.get("/", fetchPostsCtrl);

// DELETE/api/v1/posts/:id
postRoutes.delete("/:id", protected, deletePostCtrl);

// GET/api/v1/posts/:id
postRoutes.get("/:id", fetchPostCtrl);

postRoutes.get("/update-post/:id", async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  res.render("posts/updatePost", { post, error: "" });
});
// PUT/api/v1/posts/:id
postRoutes.put("/:id", protected, upload.single("file"), updatePostCtrl);
module.exports = postRoutes;
