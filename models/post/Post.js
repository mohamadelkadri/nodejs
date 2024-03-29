const mongoose = require("mongoose");

// schema

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "react js",
        "html",
        "css",
        "node js",
        "javascript",
        "other",
        "Web Development",
        "Tech Gadgets",
        "Business",
        "Health & Wellness",
      ],
    },
    image: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    ],
  },
  { timestamps: true }
);

// compile schema to forme model
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
