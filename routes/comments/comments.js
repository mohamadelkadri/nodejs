const express = require("express");
const protected = require("../../middlewares/protected");
const commentRoutes = express.Router();
const {
  createCommentCtrl,
  fetchCommentsCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../../controllers/comments/comments");

// POST/api/v1/comments
commentRoutes.post("/:id", protected, createCommentCtrl);

// GET/api/v1/comments
commentRoutes.get("/", fetchCommentsCtrl);

// GET/api/v1/comments/:id
commentRoutes.get("/:id", commentDetailsCtrl);

// DELETE/api/v1/comments/:id
commentRoutes.delete("/:id", protected, deleteCommentCtrl);

// PUT/api/v1/comments/:id
commentRoutes.put("/:id", protected, updateCommentCtrl);

module.exports = commentRoutes;
