import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends, fetchByUsername, clearUser } from "../../store/users";
import { fetchPosts, clearPostErrors, clearPosts } from "../../store/posts";
import { fetchMyFriends } from "../../store/session";
import PostBox from "../Posts/PostBox";
import { useParams } from "react-router-dom";
import AddFriendButton from "./AddFriendButton";
import { Link } from "react-router-dom";
import { useState } from "react";

function Profile() {
  const dispatch = useDispatch();
  const cuId = useSelector((state) =>
    state.session.user ? state.session.user._id : null
  );
  const { username } = useParams();
  const user = useSelector((state) =>
    state.users.user ? state.users.user : state.session.user
  );

  const profile = {
    _id: user._id,
    username: user.username,
  };

  const isOtherUser = username ? true : false;
  const friends = useSelector((state) =>
    isOtherUser
      ? state.users.friends
        ? Object.values(state.users.friends)
        : []
      : state.session.friends
      ? Object.values(state.session.friends)
      : []
  );
  const userPosts = useSelector((state) => Object.values(state.posts.display));

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (username) {
      dispatch(fetchByUsername(username));
    }
    return () => {
      dispatch(clearUser());
    };
  }, [dispatch, username]);

  useEffect(() => {
    dispatch(fetchPosts("user", profile._id));
    const fetchUserPosts = async () => {
      try {
        await dispatch(fetchPosts("user", profile._id));
        setLoading(false); // Set loading to false once posts are fetched
      } catch (error) {
        console.error(error);
      }
    };
    dispatch(fetchFriends(profile._id));
    dispatch(fetchMyFriends(cuId));
    fetchUserPosts();
    return () => {
      dispatch(clearPosts());
      dispatch(clearPostErrors());
    };
  }, [dispatch, profile._id, cuId]);

  const isFriend = friends.some((friend) => friend._id === profile._id);

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while fetching data
  }

  return (
    <>
      {isOtherUser && (
        <AddFriendButton
          friendId={profile._id}
          isFriend={isFriend}
        ></AddFriendButton>
      )}
      <h2>All of {profile.username}'s Posts</h2>
      {userPosts.map((post) => (
        <PostBox key={post._id} post={post} />
      ))}
      <h2>Friends</h2>
      {friends.map((friend) => (
        // <div key={friend._id}>{friend.username}</div>
        <div>
          <Link to={`/profile/${friend.username}`}>
            {friend.username ? `${friend.username}` : ""}
          </Link>
        </div>
      ))}
    </>
  );
}

export default Profile;
