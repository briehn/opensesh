const initialState = {
  friends: [],
};

const friendReducer = (state = initialState, action) => {
  switch (action.type) {
    case "friend/RECEIVE_FRIENDS_LIST":
      return {
        ...state,
        friends: Array.isArray(state.friends.friends)
          ? [...state.friends.friends, action.friends]
          : action.friends,
      };
    case "UPDATE_FRIEND_STATUS":
      return {
        ...state,
        [action.friendId]: action.isFriend,
      };
    case "friend/CLEAR_FRIENDS_LIST":
      return {
        ...state,
        friends: [],
      };
    default:
      return state;
  }
};

export default friendReducer;
