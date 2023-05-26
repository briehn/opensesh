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

router.get("/:postId/", async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId).populate("author", "id, username");
    return res.json(post);
  } catch (err) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    error.errors = { message: "No post found with that id" };
    return next(error);
  }
});

router.get("/:postId/likes", async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    return res.json(post.likes);
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

router.post("/", requireUser, validatePostInput, async (req, res, next) => {
  console.log(req.user);
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

router.post("/:postId/likes", requireUser, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    const like = await Like.findOne({
      user: req.user._id, // Assuming you have implemented authentication
      post: post._id,
    });
    if (like) {
      const error = new Error("User already liked this post");
      error.statusCode = 400;
      error.errors = { message: "You have already liked this post" };
      return next(error);
    }

    // Create a new like
    const newLike = new Like({
      user: req.user._id, // Assuming you have implemented authentication
      post: post._id,
    });
    await newLike.save();

    // Add the new like to the post
    post.likes.push(newLike.user);
    await post.save();

    return res.json(post);
  } catch (err) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    error.errors = { message: "No post found with that id" };
    return next(error);
  }
});

router.delete("/:postId/likes", requireUser, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      error.errors = { message: "No post found with given Id" };
      return next(error);
    }

    const like = await Like.findOneAndDelete({
      post: req.params.postId,
      user: req.user._id,
    });

    if (!like) {
      const error = new Error("Like not found");
      error.statusCode = 404;
      error.errors = { message: "No like found with given post" };
      return next(error);
    }

    post.likes = post.likes.filter((userId) => {
      userId !== req.user._id;
    });
    await post.save();
    return res.json({ message: "Like removed" });
  } catch (err) {
    const error = new Error("Error found");
    error.statusCode = 404;
    error.errors = { message: "Server error with deleting post" };
    return next(error);
  }
});

module.exports = router;
