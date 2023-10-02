import { addLikes, removeLikes } from "../../store/posts";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "./PostBox.css";

function PostBox({ post }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);

  if (!post) return null;
  const {
    author: { username },
    text,
    _id,
    likes,
  } = post;
  const liked = post.likes.includes(currentUser._id);
  const likeText = liked ? "Dislike" : "Like";
  const date = new Date(post.createdAt);

  const addLike = (e) => {
    e.preventDefault();
    liked ? dispatch(removeLikes(_id)) : dispatch(addLikes(_id));
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
        <div>Likes: {likes.length}</div>
        <button onClick={addLike}>{likeText}</button>
      </div>
    </div>
  );
}

export default PostBox;
