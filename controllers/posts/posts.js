const Post = require("../../models/post/Post");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");

const createPostCtrl = async (req, res, next) => {
  const { title, description, category, image } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      // return next(appErr("All fields are required"));
      return res.render("posts/addPost", { error: "All fields are required" });
    }
    // 1. Find the user
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    if (!userFound) {
      // return next(appErr("User not found", 404));
      return res.render("posts/addPost", { error: "User not Found" });
    }
    const postCreated = await Post.create({
      title,
      description,
      category,
      image: req.file.path,
      user: req.session.userAuth,
    });
    // push the post created into the array of user
    userFound.posts.push(postCreated._id);
    // const userUpdated = await User.findByIdAndUpdate(userId, {
    //   posts: userFound.posts,
    // });
    await userFound.save();
    // res.json({
    //   status: "success",
    //   post: postCreated,
    //   user: userFound,
    // });
    res.redirect("/");
  } catch (error) {
    // res.json(error);
    return res.render("posts/addPost", { error: error.message });
  }
};

const fetchPostsCtrl = async (req, res, next) => {
  try {
    const postsFound = await Post.find().populate("comments").populate("user");
    res.json({
      status: "success",
      posts: postsFound,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

const deletePostCtrl = async (req, res, next) => {
  try {
    // delete post
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.session.userAuth.toString()) {
      // return next(appErr("You are not allowed to delete this post", 403));
      return res.render("posts/postDetails", {
        post,
        error: "You are not allowed to delete this post",
      });
    }
    await Post.findByIdAndDelete(req.params.id);
    const posts = await Post.find();
    // res.json({
    //   status: "success",
    //   posts: posts,
    // });
    console.log("delete post");
    res.render("index", { posts, error: "" });
  } catch (error) {
    next(appErr(error.message));
  }
};

const fetchPostCtrl = async (req, res, next) => {
  try {
    // get the id from params
    const postId = req.params.id;
    const postFound = await Post.findById(postId)
      .populate({
        path: "comments",
        model: "Comment",
      })
      .populate("user");
    // res.json({
    //   status: "success",
    //   post: postFound,
    // });
    res.render("posts/postDetails", { post: postFound, error: "" });
  } catch (error) {
    next(appErr(error.message));
  }
};

const updatePostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    // update post
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.session.userAuth.toString()) {
      // return next(appErr("You are not allowed to update this post", 403));
      return res.render("posts/updatePost", {
        error: "You are not allowed to update this post",
      });
    }
    const postUpdated = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        image: req.file.path,
      },
      { new: true }
    );
    const posts = await Post.find();
    // res.json({
    //   status: "success",
    //   posts: posts,
    // });
    res.render("posts/postDetails", { post: postUpdated, error: "" });
  } catch (error) {
    next(appErr(error.message));
  }
};
module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  deletePostCtrl,
  fetchPostCtrl,
  updatePostCtrl,
};
