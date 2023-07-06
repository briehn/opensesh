import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends, fetchByUsername, clearUser } from "../../store/users";
import { fetchPosts, clearPostErrors, clearPosts } from "../../store/posts";
import PostBox from "../Posts/PostBox";
import { useParams } from "react-router-dom";
import AddFriendButton from "./AddFriendButton";
import { Link } from "react-router-dom";

function Profile() {
  const dispatch = useDispatch();

  const { username } = useParams();
  const user = useSelector((state) =>
    state.users.user ? state.users.user : state.session.user
  );

  const profile = {
    _id: user._id,
    username: user.username,
  };

  const friends = useSelector((state) =>
    state.users.friends ? Object.values(state.users.friends) : []
  );
  const userPosts = useSelector((state) => Object.values(state.posts.display));
  const isOtherUser = username ? true : false;

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
    dispatch(fetchFriends(profile._id));
    return () => {
      dispatch(clearPosts());
      dispatch(clearPostErrors());
    };
  }, [dispatch, profile._id]);

  if (userPosts.length === 0) {
    return <div>{profile.username} has no Posts</div>;
  } else {
    return (
      <>
        {isOtherUser && (
          <AddFriendButton friendId={profile._id}></AddFriendButton>
        )}
        <h2>All of {profile.username}'s Posts</h2>
        {userPosts.map((post) => (
          <PostBox key={post._id} post={post} />
        ))}
        <h2>Friends</h2>
        {friends.map((friend) => (
          // <div key={friend._id}>{friend.username}</div>
          <Link to={`/profile/${friend.username}`}>
            {friend.username ? `${friend.username}` : ""}
          </Link>
        ))}
      </>
    );
  }
}

export default Profile;
