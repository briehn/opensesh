const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Like = mongoose.model("Like");
const Friend = mongoose.model("Friend");
const { requireUser } = require("../../config/passport");
const validatePostInput = require("../../validations/posts");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "_id, username")
      .sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    return res.json([]);
  }
});

router.get("/user/:userId/friends", async (req, res, next) => {
  try {
    const friends = await Friend.find({
      user: req.params.userId,
    });

    // Retrieve the ids of the friends
    const friendIds = friends.map((friend) => friend.friend);

    // Find all the posts made by the friends
    const posts = await Post.find({
      author: { $in: friendIds },
    }).populate("author", "_id, username");

    return res.json(posts);
  } catch (err) {
    const error = new Error("Friends post not found");
    error.statusCode = 404;
    error.errors = { message: "No friends post were found with that id" };
    return next(error);
  }
});

router.get("/:postId/likes", async (req, res) => {
  const postId = req.params.postId;
  try {
    const likesCount = await Like.aggregate([
      { $match: { post: mongoose.Types.ObjectId(postId) } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);
    res.json({ likes: likesCount[0]?.count ?? 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/:userId", async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.userId);
  } catch (err) {
    const error = new Error("User not found");
    error.statusCode = 404;
    error.errors = { message: "No user found with that id" };
    return next(error);
  }
  try {
    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("author", "_id, username");
    return res.json(posts);
  } catch (err) {
    return res.json([]);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "id, username"
    );
    return res.json(post);
  } catch (err) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    error.errors = { message: "No post found with that id" };
    return next(error);
  }
});

// returns likes of singular post
router.get("/:id/likes", async (req, res, next) => {
  try {
    const likes = await Like.find({
      post: req.params.id,
    });
    return res.json(likes);
  } catch (err) {
    const error = new Error(
      "Error has occurred when retrieving likes of a post"
    );
    error.statusCode = 404;
    error.errors = {
      message: "Serverside error when retrieving likes of a post",
    };
    return next(error);
  }
});

router.post("/", requireUser, validatePostInput, async (req, res, next) => {
  try {
    const newPost = new Post({
      text: req.body.text,
      author: req.user._id,
    });

    let post = await newPost.save();
    post = await post.populate("author", "_id, username");
    return res.json(post);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
