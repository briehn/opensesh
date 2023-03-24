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

module.exports = router;
