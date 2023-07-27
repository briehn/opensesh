import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addFriend,
  removeFriend,
  fetchFriends,
} from "../../store/friendAction";

const AddFriendButton = ({ friendId }) => {
  const dispatch = useDispatch();
  const cuId = useSelector((state) => state.session.user._id);
  const friendsList = useSelector((state) => state.friends.friends);
  const isFriend =
    friendsList.findIndex((friend) => friend._id === cuId) !== -1;

  const handleAddFriend = async () => {
    dispatch(addFriend(friendId, cuId));
    dispatch(fetchFriends(friendId));
  };

  const handleRemoveFriend = async () => {
    dispatch(removeFriend(friendId, cuId));
    dispatch(fetchFriends(friendId));
  };

  return (
    <button
      className="friend-button"
      onClick={isFriend ? handleRemoveFriend : handleAddFriend}
    >
      {isFriend ? "Remove Friend" : "Add Friend"}
    </button>
  );
};

export default AddFriendButton;
