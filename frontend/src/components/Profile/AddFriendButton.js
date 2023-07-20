import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFriend, removeFriend } from "../../store/friendAction";
import { updateFriendStatus } from "../../store/friendAction";
import { fetchFriends } from "../../store/users";
import { fetchMyFriends } from "../../store/session";

const AddFriendButton = ({ friendId }) => {
  const dispatch = useDispatch();
  const cuId = useSelector((state) => state.session.user._id);
  const friendsList = useSelector((state) => state.session.friends);
  const isFriend =
    friendsList.findIndex((friend) => friend._id === friendId) !== -1;

  const handleAddFriend = async () => {
    dispatch(addFriend(friendId, cuId));
    dispatch(addFriend(cuId, friendId));
    // dispatch(updateFriendStatus(friendId, true));
  };

  const handleRemoveFriend = async () => {
    dispatch(removeFriend(friendId, cuId));
    dispatch(removeFriend(cuId, friendId));
    // dispatch(updateFriendStatus(friendId, false));
  };

  // useEffect(() => {
  //   dispatch(fetchFriends(friendId));
  //   dispatch(fetchMyFriends(cuId));
  // }, [dispatch]);

  return (
    <button onClick={isFriend ? handleRemoveFriend : handleAddFriend}>
      {isFriend ? "Remove Friend" : "Add Friend"}
    </button>
  );
};

export default AddFriendButton;
