const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Like = mongoose.model("Like");
const Friend = mongoose.model("Friend");
const passport = require("passport");
const { loginUser, restoreUser } = require("../../config/passport");
const { isProduction } = require("../../config/keys");
const { requireUser } = require("../../config/passport");
const validateRegisterInput = require("../../validations/register");
const validateLoginInput = require("../../validations/login");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    return res.json(users);
  } catch (err) {
    return res.json([]);
  }
});

router.post("/register", validateRegisterInput, async (req, res, next) => {
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });

  if (user) {
    const err = new Error("Validation Error");
    err.statusCode = 400;
    const errors = {};
    if (user.email === req.body.email) {
      errors.email = "A user has already registered with this email";
    }
    if (user.username === req.body.username) {
      errors.username = "A user has already registered with this username";
    }
    err.errors = errors;
    return next(err);
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
  });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
      if (err) throw err;
      try {
        newUser.hashedPassword = hashedPassword;
        const user = await newUser.save();
        return res.json(await loginUser(user));
      } catch (err) {
        next(err);
      }
    });
  });
});

// returns likes of singular user
router.get("/:id/likes", async (req, res, next) => {
  try {
    const likes = await Like.find({
      user: req.params.id,
    });
    return res.json(likes);
  } catch (err) {
    const error = new Error(
      "Error has occurred when retrieving likes of a user"
    );
    error.statusCode = 404;
    error.errors = {
      message: "Serverside error when retrieving likes of a user",
    };
    return next(error);
  }
});

router.get("/current", restoreUser, (req, res) => {
  if (!isProduction) {
    const csrfToken = req.csrfToken();
    res.cookie("CSRF-TOKEN", csrfToken);
  }
  if (!req.user) return res.json(null);
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
});

router.get("/search/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });
    return res.json({
      _id: user._id,
      username: user.username,
    });
  } catch (err) {
    const error = new Error(
      "Error has occurred when retrieving user by username"
    );
    error.statusCode = 404;
    error.errors = {
      message: "Sderverside error when retrieving user info",
    };
    return next(error);
  }
});

// returns friends of a singular user
// requireUser: must be logged in to see others friendslist
router.get("/:id/friends/", async (req, res, next) => {
  try {
    const friends = await Friend.find({
      user: req.params.id,
    });
    const friendIds = friends.map((friend) => friend.friend);
    const names = await User.find({
      _id: { $in: friendIds },
    }).populate("username");
    return res.json(names);
  } catch (err) {
    const error = new Error(
      "Error has occurred when retrieving friends of a user"
    );
    error.statusCode = 404;
    error.errors = {
      message: "Serverside errror when retrieving user friends",
    };
    return next(error);
  }
});

// POST /api/users/login
router.post("/login", validateLoginInput, async (req, res, next) => {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);
    if (!user) {
      const err = new Error("Invalid credentials");
      err.statusCode = 400;
      err.errors = { email: "Invalid credentials" };
      return next(err);
    }
    return res.json(await loginUser(user));
  })(req, res, next);
});

module.exports = router;
