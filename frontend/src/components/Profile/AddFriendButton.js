import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFriend, removeFriend } from "../../store/friendAction";

const AddFriendButton = ({ friendId }) => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friend.friends);

  const isFriend = friends.some((friend) => friend._id === friendId);

  const handleAddFriend = () => {
    dispatch(addFriend(friendId));
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
