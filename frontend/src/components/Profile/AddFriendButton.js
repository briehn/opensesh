import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFriend, removeFriend } from "../../store/friendAction";

const AddFriendButton = ({ friendId }) => {
  const dispatch = useDispatch();
  const cuId = useSelector((state) => state.session.user._id);
  const friends = useSelector((state) => state.session.friends);

  const isFriend = friends.some((friend) => friend._id === friendId);

  //Add friend state to session store
  /*
    state 
      session
        user (current session user)
          friends (current session user friends)
      users (user profile)
        friends (user friends)
        user
  */

  const handleAddFriend = () => {
    //Refactor to 1 line
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
