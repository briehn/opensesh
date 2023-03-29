import { addLikes } from "../../store/posts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

function PostBox({ post }) {
  const dispatch = useDispatch();
  const username = post ? post.author.username : "";
  const text = post ? post.text : "";
  const id = post ? post._id : "";
  const likes = post ? post.likes.length : 0;

  const addLike = (e) => {
    e.preventDefault();
    dispatch(addLikes(id));
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
      <button onClick={addLike}>Like This Post</button>
    </div>
  );
}

export default PostBox;
