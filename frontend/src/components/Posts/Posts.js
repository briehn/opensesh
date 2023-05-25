import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPostErrors, fetchPosts, clearPosts } from "../../store/posts";
import PostBox from "./PostBox";

function Posts() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => Object.values(state.posts.display));

  useEffect(() => {
    dispatch(fetchPosts("all"));
    return () => {
      dispatch(clearPosts());
      dispatch(clearPostErrors());
    };
  }, [dispatch]);

  if (posts.length === 0) return <div>There are no Posts</div>;

  return (
    <>
      <h2>All Posts</h2>
      <div className="feed">
        {posts.map((post) => (
          <PostBox key={post._id} post={post} />
        ))}
      </div>
    </>
  );
}

export default Posts;
