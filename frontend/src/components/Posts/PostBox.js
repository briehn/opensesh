import { addLikes, fetchPosts, removeLikes } from "../../store/posts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

function PostBox({ post }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const username = post ? post.author.username : "";
  const text = post ? post.text : "";
  const id = post ? post._id : "";
  const likes = post ? post.likes.length : 0;
  const liked = post.likes.includes(currentUser._id);
  const likeText = liked ? "Dislike" : "Like";

  const addLike = (e) => {
    e.preventDefault();
    if (liked) {
      dispatch(removeLikes(id));
    } else {
      dispatch(addLikes(id));
    }
  };

  if (!post) {
    return null;
  }

  return (
    <div className="post">
      <h3>
        {username ? `${username}:` : ""} {text}
        {"\n"}
        Likes: {likes}
      </h3>
      <button onClick={addLike}>{likeText}</button>
    </div>
  );
}

export default PostBox;
