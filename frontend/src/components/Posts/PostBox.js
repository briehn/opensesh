import { addLikes } from "../../store/posts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

function PostBox({ post }) {
  const dispatch = useDispatch();
  const username = post.author.username;
  const text = post.text;
  const id = post._id;
  const likes = post.likes.length;

  const addLike = (e) => {
    e.preventDefault();
    dispatch(addLikes(id));
  };

  return (
    <div className="post">
      <h3>
        {username ? `${username}:` : ""} {text} Likes: {likes}
      </h3>
      <button onClick={addLike}>Like This Post</button>
    </div>
  );
}

export default PostBox;
