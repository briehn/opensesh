const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { requireUser } = require("../../config/passport");
const Like = require("../../models/Like");

router.delete("/:id", requireUser, async (req, res, next) => {
  Like.findByIdAndDelete(req.params.id, (err, itn) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send({ Success: "Like deleted" });
    }
  });
});

router.post("/user/:userId", requireUser, async (req, res, next) => {
  try {
    const newLike = new Like({
      post: req.body.postId,
      user: req.params.userId,
    });
    let like = await newLike.save();
    return res.json(like);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
