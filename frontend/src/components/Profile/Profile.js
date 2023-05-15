import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends, fetchByUsername } from "../../store/users";
import { fetchUserPosts, clearPostErrors } from "../../store/posts";
import PostBox from "../Posts/PostBox";
import { useParams } from "react-router-dom";

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

  const { username } = useParams();
  const user = useSelector((state) => (state.user ? state.user._id : []));
  //if no username parameter, use currentUser
  const currentUser = useSelector((state) => state.session.user);

  const userId = username ? user : currentUser._id;
  const profile = username ? username : currentUser.username;

  const friends = useSelector((state) =>
    state.session.friends ? Object.values(state.session.friends) : []
  );
  const userPosts = useSelector((state) => Object.values(state.posts.user));

  useEffect(() => {
    dispatch(fetchUserPosts(userId));
    dispatch(fetchFriends(userId));
    return () => dispatch(clearPostErrors());
  }, [dispatch, username, userId]);

  if (userPosts.length === 0) {
    return <div>{profile} has no Posts</div>;
  } else {
    return (
      <>
        <h2>All of {profile}'s Posts</h2>
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
