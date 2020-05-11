const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");
const User = mongoose.model("User");

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/updateprofile", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { profileImage: req.body.profileImage },
    },
    {
      new: true,
    }
  )
    .select("-password -email")
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      return res.status(422).json({ error: "Profile not updated" });
    });
});

router.post("/search", (req, res) => {
  let userPattern = new RegExp("^" + req.body.query, "i");

  User.find({ name: { $regex: userPattern } })
    .select("_id name profileImage")
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/updateuserdetails", requireLogin, (req, res) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { name, email },
    },
    {
      new: true,
    }
  )
    .select("-password -profileImage -followers -following")
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
});

// router.delete("/deleteuser", requireLogin, (req, res) => {
//   User.findOne({ _id: req.user._id }).exec((err, user) => {
//     if (err || !user) {
//       return res.status(422).json({ error: err });
//     } else {
//       Post.find({
//         postedBy: { $in: req.user._id },
//       }).exec((err, post) => {
//         if (err || !post) {
//           return res.status(422).json({ error: err });
//         }
//         post.map((item) => {
//           item.remove();
//         });
//       });

//       if (req.user.following.length !== 0) {
//         req.user.following.map((item) => {
//           User.findByIdAndUpdate(
//             item._id,
//             {
//               $pull: { followers: req.user._id },
//             },
//             { new: true },
//             (err, result) => {
//               if (err) {
//                 return res.status(422).json({ error: err });
//               }
//             }
//           );
//         });
//       }

//       if (req.user.followers.length !== 0) {
//         req.user.following.map((item) => {
//           User.findByIdAndUpdate(
//             item._id,
//             {
//               $pull: { following: req.user._id },
//             },
//             { new: true },
//             (err, result) => {
//               if (err) {
//                 return res.status(422).json({ error: err });
//               }
//             }
//           );
//         });
//       }

//       Post.find({
//         "comments.postedBy": { $in: req.user._id },
//       })
//         .populate("comments.postedBy", "_id", "User")
//         .exec((err, posts) => {
//           if (err || !posts) {
//             return res.status(422).json({ error: err });
//           } else {
//             console.log("Posts", posts);

//             posts.map((item) => {
//               console.log("running deletion..");
//               Post.findByIdAndUpdate(
//                 item._id,
//                 {
//                   $pull: { comments: { _id: req.body.commentId } },
//                 },
//                 {
//                   new: true,
//                 }
//               );
//             });

//             user
//               .remove()
//               .then((result) => {
//                 res.json({ message: "User Deleted" });
//               })
//               .catch((err) => {
//                 console.log(err);
//               });
//           }
//         });
//     }
//   });
// });

router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password -email")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name profileImage")
        .populate("comments.postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found." });
    });
});

module.exports = router;
