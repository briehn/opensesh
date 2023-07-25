const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Friend = mongoose.model("Friend");
const { requireUser } = require("../../config/passport");

router.post("/:friendId", requireUser, async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const friendId = req.params.friendId;

    const newFriendForUser = new Friend({
      user: userId,
      friend: friendId,
    });
    const userFriend = await newFriendForUser.save();

    const newFriendForAddedFriend = new Friend({
      user: friendId,
      friend: userId,
    });
    const addedFriend = await newFriendForAddedFriend.save();

    return res.json({ addedFriend });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:friendId/:userId", requireUser, async (req, res, next) => {
  try {
    const friend = await Friend.findOneAndDelete({
      user: req.params.userId,
      friend: req.params.friendId,
    });

    const friend2 = await Friend.findOneAndDelete({
      user: req.params.friendId,
      friend: req.params.userId,
    });

    if (!friend || !friend2) {
      const error = new Error("User is not friends with this person");
      error.statusCode = 400;
      error.errors = {
        message: "You are not friends with this person. Please contact staff.",
      };
      return next(error);
    }

    return res.json({ message: "Friend removed" });
  } catch (err) {
    const error = new Error("Error found test");
    error.statusCode = 404;
    error.errors = { message: "Server error with deleting friend" };
    return next(error);
  }
});

module.exports = router;
