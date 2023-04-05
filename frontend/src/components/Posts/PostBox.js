import { addLikes, fetchPosts, removeLikes } from "../../store/posts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

function PostBox({ post }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);

  //ugly declaration, must fix
  const username = post.author.username;
  const text = post.text;
  const id = post._id;
  const likes = post.likes.length;
  const liked = post.likes.includes(currentUser._id);
  const likeText = liked ? "Dislike" : "Like";

  const addLike = (e) => {
    e.preventDefault();
    liked ? dispatch(removeLikes(id)) : dispatch(addLikes(id));
  };

  if (!post) return null;

  return (
    <div className="post">
      <h3>
        {username ? `${username}:` : ""} {text}
        <div>Likes: {likes}</div>
      </h3>
      <button onClick={addLike}>{likeText}</button>
    </div>
  );
}

export default PostBox;
