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

// router.delete("/:friendId", requireUser, async (req, res, next) => {
//   Friend.findByIdAndDelete(req.params.friendId, (err, itn) => {
//     if (err) {
//       res.status(400).send(err);
//     } else {
//       res.send({ Success: "Friend deleted" });
//     }
//   });
// });

router.delete("/:friendId/:userId", requireUser, async (req, res, next) => {
  try {
    const friend = await Friend.findOneAndDelete({
      user: req.params.userId,
      friend: req.params.friendId
    });

    if (!friend) {
      const error = new Error("User is not friends with this person");
      error.statusCode = 400;
      error.errors = { message: "You are not friends with this person. Please contact staff." };
      return next(error);
    }

    return res.json({message: "Friend removed"});
  } catch (err) {
    const error = new Error("Error found test");
    error.statusCode = 404;
    error.errors = { message: "Server error with deleting friend" };
    return next(error);
  }
})

module.exports = router;
