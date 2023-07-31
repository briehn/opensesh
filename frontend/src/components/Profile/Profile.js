import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchByUsername, clearUser } from "../../store/users";
import { fetchPosts, clearPostErrors, clearPosts } from "../../store/posts";
import { fetchFriends, clearFriendsList } from "../../store/friendAction";
import PostBox from "../Posts/PostBox";
import { useParams } from "react-router-dom";
import AddFriendButton from "./AddFriendButton";
import { Link } from "react-router-dom";

import "./Profile.css";

function Profile() {
  const dispatch = useDispatch();
  const cuId = useSelector((state) =>
    state.session.user ? state.session.user._id : null
  );
  const { username } = useParams();
  const user = useSelector((state) =>
    state.users.user ? state.users.user : state.session.user
  );
  const friends = useSelector((state) =>
    state.friends.friends ? state.friends.friends : []
  );

  const profile = {
    _id: user._id,
    username: user.username,
  };

  const isOtherUser = username ? true : false;

  const userPosts = useSelector((state) => Object.values(state.posts.display));

  const [loading, setLoading] = useState(true);

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

        if (username) {
          await dispatch(fetchFriends(profile._id));
        } else {
          await dispatch(fetchFriends(cuId));
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInfo();
    return () => {
      dispatch(clearPosts());
      dispatch(clearPostErrors());
      dispatch(clearFriendsList());
    };
  }, [dispatch, profile._id, cuId, username]);

  if (loading) {
    return;
  }

  return (
    <div className="profile-container">
      <div className="profile-left-container">
        <div className="profile-pic-container">Insert Profile Pic</div>
        <div className="add-friend-container">
          {isOtherUser && <AddFriendButton friendId={profile._id} />}
        </div>
        <div className="profile-friends-container">
          {" "}
          <h2>Friends</h2>
          {Object.values(friends).map((friend) => (
            <div key={friend._id}>
              <Link
                to={
                  friend._id !== cuId
                    ? `/profile/${friend.username}`
                    : `/profile/`
                }
              >
                {friend.username ? friend.username : ""}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="profile-center-container">
        <div className="profile-showcase-container">
          <div className="showcase-prompt-count">
            <div className="prompt-count-header">Prompts Answered</div>
            <div className="prompt-count-val">25</div>
          </div>
          <div className="showcase-popular">
            <div className="popular-header">Most Liked Answer</div>
            <div className="popular-val">Cake cake cake</div>
          </div>
        </div>
        <div className="profiel-feed-container">
          <h2>All of {profile.username}'s Posts</h2>
          {userPosts.map((post) => (
            <PostBox key={post._id} post={post} />
          ))}
        </div>
      </div>
      <div className="profile-right-container">
        <div className="profile-feed-container">FRIEND FEED</div>
      </div>
    </div>
  );
}

export default Profile;
