import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearPostErrors,
  fetchPosts,
  fetchFriendPosts,
} from "../../store/posts";
import PostBox from "../Posts/PostBox";

function MainPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const [filter, setFilter] = useState(true);
  const posts = useSelector((state) =>
    filter ? Object.values(state.posts.friends) : Object.values(state.posts.all)
  );
  const heading = filter ? "Your Sesh" : "Popular Posts";

  useEffect(() => {
    if (filter) {
      dispatch(fetchFriendPosts(currentUser._id));
    } else {
      dispatch(fetchPosts());
    }
  }, [dispatch, filter, currentUser._id]);

  if (posts.length === 0) {
    return (
      <>
        <h2>{heading}</h2>
        <div>There are no Posts</div>
      </>
    );
  }

  return (
    <>
      <h2>{heading}</h2>
      {posts.map((post) => (
        <PostBox
          key={post._id}
          text={post.text}
          username={post.author.username}
        />
      ))}
      <footer>Copyright &copy; 2023 OpenSesh</footer>
    </>
  );
}

export default MainPage;
