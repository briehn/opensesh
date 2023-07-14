import { addLikes, removeLikes } from "../../store/posts";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "./PostBox.css";

function PostBox({ post }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);

  //ugly declaration, must fix

  if (!post) return null;
  const username = post.author.username;
  const text = post.text;
  const id = post._id;
  const likes = post.likes.length;
  const liked = post.likes.includes(currentUser._id);
  const likeText = liked ? "Dislike" : "Like";
  const date = new Date(post.createdAt);

  const addLike = (e) => {
    e.preventDefault();
    liked ? dispatch(removeLikes(id)) : dispatch(addLikes(id));
  };

  return (
    <div className="post">
      <div className="postbox-container">
        <Link
          to={
            username === currentUser.username
              ? `/profile`
              : `/profile/${username}`
          }
        >
          {username ? `${username}:` : ""}{" "}
        </Link>{" "}
        {text}
        <div>
          Date Posted:{" "}
          {date.toLocaleString("en-GB", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div>Likes: {likes}</div>
        <button onClick={addLike}>{likeText}</button>
      </div>
    </div>
  );
}

export default PostBox;
