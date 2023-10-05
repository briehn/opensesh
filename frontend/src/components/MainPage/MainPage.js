import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPostErrors, fetchPosts, clearPosts } from "../../store/posts";
import { fetchFriends } from "../../store/friendAction";

import PostBox from "../Posts/PostBox";
import "./MainPage.css";

function Heading({ filter, setFilter }) {
  const currentFriends = useSelector((state) => state.friends.friends);
  return (
    <div className="filter-container">
      <button
        className={`filter pop ${!filter ? "active" : ""}`}
        onClick={() => setFilter(false)}
      >
        Popular Posts
      </button>{" "}
      {currentFriends.length > 0 && (
        <>
          {" "}
          |{" "}
          <button
            className={`filter sesh ${filter ? "active" : ""}`}
            onClick={() => setFilter(true)}
          >
            Your Sesh
          </button>
        </>
      )}
    </div>
  );
}

const MemoizedHeading = React.memo(Heading);

function MainPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const [filter, setFilter] = useState(false);
  const posts = useSelector((state) =>
    state.posts.display ? Object.values(state.posts.display) : []
  );
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        if (filter) {
          dispatch(fetchPosts("friend", currentUser._id));
        } else {
          dispatch(fetchPosts("all", 0, "likes"));
        }
        dispatch(fetchFriends(currentUser._id));
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInfo();
    return () => {
      dispatch(clearPosts());
      dispatch(clearPostErrors());
    };
  }, [dispatch, filter, currentUser._id]);

  if (loading) {
    return null;
  }

  return (
    <div className="mainbox-container">
      <MemoizedHeading filter={filter} setFilter={setFilter} />
      <div className="posts-container">
        {posts.map((post) => (
          <PostBox key={post._id} post={post} />
        ))}
      </div>
      <footer>&copy; 2023 OpenSesh</footer>
    </div>
  );
}

export default MainPage;
