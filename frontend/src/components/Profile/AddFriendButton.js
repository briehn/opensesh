import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFriend, removeFriend } from "../../store/friendAction";
import { updateFriendStatus } from "../../store/friendAction";

const AddFriendButton = ({ friendId }) => {
  const dispatch = useDispatch();
  const cuId = useSelector((state) => state.session.user._id); 
  const friendsList = useSelector((state) => state.session.friends);
  const isFriend = friendsList.findIndex((friend) => friend._id === friendId) !== -1;

  const handleAddFriend = async () => {
    await dispatch(addFriend(friendId, cuId));
    await dispatch(addFriend(cuId, friendId));
    dispatch(updateFriendStatus(friendId, true));
  };

  const handleRemoveFriend = async () => {
    await dispatch(removeFriend(friendId, cuId));
    await dispatch(removeFriend(cuId, friendId));
    dispatch(updateFriendStatus(friendId, false));
  };

  return (
    <button onClick={isFriend ? handleRemoveFriend : handleAddFriend}>
      {isFriend ? "Remove Friend" : "Add Friend"}
    </button>
  );
};

export default AddFriendButton;
