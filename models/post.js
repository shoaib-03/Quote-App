const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: true,
    },
    quoteBy: {
      type: String,
      required: true,
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [{ text: String, postedBy: { type: ObjectId, ref: "User" } }],
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    twitterLink: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model("Post", postSchema);
