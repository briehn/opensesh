const initialState = {
  friends: [],
};

const friendReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RECEIVE_FRIENDS_LIST":
      return {
        ...state,
        friends: [...state.friends.friends, action.friends],
      };
    case "REMOVE_FRIEND":
      return {
        ...state,
        friends: state.friends.filter(
          (friend) => friend._id !== action.friendId
        ),
      };
    case "UPDATE_FRIEND_STATUS":
      return {
        ...state,
        [action.friendId]: action.isFriend,
      };
    default:
      return state;
  }
};

export default friendReducer;
