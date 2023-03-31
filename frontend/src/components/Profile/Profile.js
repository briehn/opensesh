import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends } from "../../store/session";
import { fetchUserPosts, clearPostErrors } from "../../store/posts";
import PostBox from "../Posts/PostBox";

function Profile() {
  /* 
    TODO:
      - Add function to view other user profiles
        + Remove currentUser variable
          OPTIONS:
            1) 2 Different Components: (1) My Profile (2) Other Profile
            2) 1 Component: Adjust component based on view (user or other)
      - Refactor accordingly for currentUser
  */

  const dispatch = useDispatch();
  const friends = useSelector((state) =>
    state.session.friends ? Object.values(state.session.friends) : {}
  );
  const currentUser = useSelector((state) => state.session.user);
  const userPosts = useSelector((state) => Object.values(state.posts.user));

  useEffect(() => {
    dispatch(fetchUserPosts(currentUser._id));
    dispatch(fetchFriends(currentUser._id));
    return () => dispatch(clearPostErrors());
  }, [currentUser, dispatch]);

  if (userPosts.length === 0) {
    return <div>{currentUser.username} has no Posts</div>;
  } else {
    return (
      <>
        <h2>All of {currentUser.username}'s Posts</h2>
        {userPosts.map((post) => (
          <PostBox key={post._id} post={post} />
        ))}
        <h2>Friends</h2>
        {friends.map((friend) => (
          <div key={friend._id}>{friend.username}</div>
        ))}
      </>
    );
  }
}

export default Profile;
