const Comment = require("../../models/comment/Comment");
const Post = require("../../models/post/Post");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");

const createCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    // find post to be commented
    const post = await Post.findById(req.params.id);
    // create comment
    const comment = await Comment.create({
      message,
      user: req.session.userAuth,
    });
    // add to post
    console.log(post);
    post.comments.push(comment._id);
    // find the user
    const user = await User.findById(req.session.userAuth);
    user.comments.push(comment._id);
    // disable validation
    // save
    await post.save({ validationBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    res.json({
      status: "success",
      data: { user, post, comment },
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

const fetchCommentsCtrl = async (req, res, next) => {
  try {
    const comments = await Comment.find();
    res.json({
      status: "successfull",
      comments,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

const commentDetailsCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: `comments user ${req.params.id}`,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

const deleteCommentCtrl = async (req, res) => {
  try {
    // delete comment
    const comment = await Comment.findById(req.params.id);
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to delete this comment", 403));
    }
    await Comment.findByIdAndDelete(req.params.id);
    const comments = await Comment.find();
    res.json({
      status: "success",
      comments,
    });
  } catch (error) {
    res.json(error);
  }
};

const updateCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    // update comment
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(appErr("Comment not found"));
    }
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to update this comment", 403));
    }
    const commentUpdated = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        message,
      },
      { new: true }
    );
    const comments = await Comment.find();
    res.json({
      status: "success",
      comments,
    });
  } catch (error) {
    res.json(error);
  }
};
module.exports = {
  createCommentCtrl,
  fetchCommentsCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
};
