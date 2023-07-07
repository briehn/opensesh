import React from "react";
import { useDispatch } from "react-redux";
import { addFriend, removeFriend } from "../../store/friendAction";
import { useSelector } from "react-redux";

const AddFriendButton = ({ friendId, isFriend }) => {
  const dispatch = useDispatch();
  const cuId = useSelector((state) => state.session.user._id);

  const handleAddFriend = () => {
    dispatch(addFriend(friendId, cuId));
    dispatch(addFriend(cuId, friendId));
  };

  const handleRemoveFriend = () => {
    dispatch(removeFriend(friendId));
  };

  return (
    <button onClick={isFriend ? handleRemoveFriend : handleAddFriend}>
      {isFriend ? "Remove Friend" : "Add Friend"}
    </button>
  );
};

export default AddFriendButton;
