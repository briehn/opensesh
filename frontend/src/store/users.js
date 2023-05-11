import jwtFetch from "./jwt";

const RECEIVE_USER_FRIENDS = "users/RECEIVE_USER_FRIENDS";
const RECEIVE_USER_ERRORS = "users/RECEIVE_USER_ERRORS";

const receiveUserFriends = (friends) => ({
  type: RECEIVE_USER_FRIENDS,
  friends,
});

const receiveErrors = (errors) => ({
  type: RECEIVE_USER_ERRORS,
  errors,
});

export const fetchFriends = (userId) => async (dispatch) => {
  try {
    const res = await jwtFetch(`/api/users/${userId}/friends`);
    const friends = await res.json();
    dispatch(receiveUserFriends(friends));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};

//add fetchByUsername
export const fetchByUsername = (username) => async (dispatch) => {};

const initialState = {
  user: undefined,
  friends: {},
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_USER_FRIENDS:
      return { ...state, friends: action.friends };
    default:
      return state;
  }
};

export default usersReducer;
