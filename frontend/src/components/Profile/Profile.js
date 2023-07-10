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
  const cuFriends = useSelector((state) =>
    state.session.user ? state.session.friends : []
  );
  const userFriends = useSelector((state) =>
    state.users.friends ? state.users.friends : []
  );

  const profile = {
    _id: user._id,
    username: user.username,
  };

  const isOtherUser = username ? true : false;
  const friends = useSelector((state) =>
    isOtherUser
      ? userFriends
        ? Object.values(userFriends)
        : []
      : cuFriends
      ? Object.values(cuFriends)
      : []
  );

  const isFriend = Object.values(cuFriends).some(
    (friend) => friend._id === profile._id
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
    const fetchInfo = async () => {
      try {
        await dispatch(fetchPosts("user", profile._id));
        await dispatch(fetchFriends(profile._id));
        await dispatch(fetchMyFriends(cuId));
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInfo();
    return () => {
      dispatch(clearPosts());
      dispatch(clearPostErrors());
    };
  }, [dispatch, profile._id, cuId]);

  if (loading) {
    return;
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
