const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");

router.get("/home", requireLogin, (req, res) => {
  Post.find({
    postedBy: { $in: [req.user.following, req.user._id] },
  })
    .populate("postedBy", "_id name profileImage")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      return res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/explore", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name profileImage")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      return res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      return res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { quote, quoteBy, twitterLink } = req.body;

  if (!quote || !quoteBy || !twitterLink) {
    return res.status(422).json({ error: "Please add all the feilds." });
  }

  req.user.password = undefined;

  const post = new Post({
    quote,
    quoteBy,
    twitterLink,
    postedBy: req.user,
  });

  post
    .save()
    .then((result) => {
      return res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name profileImage")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name profileImage")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name profileImage")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/deletecomment", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { comments: { _id: req.body.commentId } },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name profileImage")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;
