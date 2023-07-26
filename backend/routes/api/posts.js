const express = require("express");
const axios = require("axios");
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
    const sortBy = req.query.filter;

    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
        },
      },
      {
        $sort: {
          likesCount: sortBy === "likes" ? -1 : 1,
          createdAt: -1,
        },
      },
      {
        $project: {
          "author._id": 1,
          "author.username": 1,
          likes: 1,
          text: 1,
          createdAt: 1,
        },
      },
    ]);

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
    }).populate("author", "_id username createdAt");

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

    const like = await Like.findOne({
      user: req.user._id,
      post: post._id,
    });
    if (like) {
      const error = new Error("User already liked this post");
      error.statusCode = 400;
      error.errors = { message: "You have already liked this post" };
      return next(error);
    }

    const newLike = new Like({
      user: req.user._id,
      post: post._id,
    });
    await newLike.save();

    post.likes.push(newLike.user);
    await post.save();

    return res.json(post);
  } catch (err) {
    console.error(err); // Log the actual error for debugging purposes
    const error = new Error("Server error with deleting post");
    error.statusCode = 404; // Use 500 for server errors
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
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);
    post.likes = post.likes.filter((userId) => !userId.equals(userObjectId));

    await post.save();
    if (!like) {
      const error = new Error(
        " \nLike not found with user: \n\t" +
          req.user._id +
          "\nOn post: \n\t" +
          req.params.postId +
          "\nLikes Of Post:" +
          post.likes.map((like) => "\n\t" + like)
      );
      error.statusCode = 404;
      error.errors = { message: "No like found with given post" };
      return next(error);
    }

    return res.json({ message: "Like removed" });
  } catch (err) {
    console.error(err);
    const error = new Error("Server error with deleting post");
    error.statusCode = 404; // Use 500 for server errors
    return next(error);
  }
});

module.exports = router;
