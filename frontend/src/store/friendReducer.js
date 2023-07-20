const initialState = {
  friends: [],
};

const friendReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_FRIENDS":
      return {
        ...state,
        friends: [...state.friends, action.friend],
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
