import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPostErrors, fetchPosts, clearPosts } from "../../store/posts";
import PostBox from "./PostBox";
import { useState } from "react";

function Posts() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => Object.values(state.posts.display));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        await dispatch(fetchPosts("all"));
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
      return () => {
        dispatch(clearPosts());
        dispatch(clearPostErrors());
      };
    };
    fetchInfo();
  }, [dispatch]);

  if (loading) {
    return;
  }
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
