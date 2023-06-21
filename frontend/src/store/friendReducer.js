const initialState = {
  friends: [],
};

const friendReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_FRIEND":
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
    default:
      return state;
  }
};

export default friendReducer;
