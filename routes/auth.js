const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");

router.post("/signup", (req, res) => {
  const { name, email, password, profileImage } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please add all the feilds." });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exist with that email." });
      }
      bcryptjs
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            name,
            email,
            password: hashedPassword,
            profileImage,
          });

          user
            .save()
            .then((user) => {
              return res.json({ message: "Signup successfully." });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please add Email or Password." });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Email or Password" });
      }
      bcryptjs
        .compare(password, savedUser.password)
        .then((isMatched) => {
          if (isMatched) {
            // return res.json({ message: "Successfully Signed In." });
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const {
              _id,
              name,
              email,
              followers,
              following,
              profileImage,
            } = savedUser;
            return res.json({
              token,
              user: { _id, name, email, followers, following, profileImage },
            });
          } else {
            return res.status(422).json({ error: "Invalid Email or Password" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
