const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Friend = mongoose.model("Friend");
const { requireUser } = require("../../config/passport");

router.post("/:friendId", requireUser, async (req, res, next) => {
  try {
    const newFriend = new Friend({
      user: req.body.userId,
      friend: req.params.friendId,
    });
    let friend = await newFriend.save();
    return res.json(friend);
  } catch (err) {
    return next(err);
  }
});

/*
 Weird, don't use findByIdAndDelete,
 Instead, search by userId and friendId
*/

router.delete("/:friendId", requireUser, async (req, res, next) => {
  Friend.findByIdAndDelete(req.params.friendId, (err, itn) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send({ Success: "Friend deleted" });
    }
  });
});

module.exports = router;
