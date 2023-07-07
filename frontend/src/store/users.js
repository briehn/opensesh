import jwtFetch from "./jwt";

const RECEIVE_USER_FRIENDS = "users/RECEIVE_USER_FRIENDS";
const RECEIVE_USER_ERRORS = "users/RECEIVE_USER_ERRORS";
const RECEIVE_BY_USERNAME = "users/RECEIVE_BY_USERNAME";
const CLEAR_USER = "users/CLEAR_USER";

const receiveUserFriends = (friends) => ({
  type: RECEIVE_USER_FRIENDS,
  friends,
});

const receiveErrors = (errors) => ({
  type: RECEIVE_USER_ERRORS,
  errors,
});

const receiveByUsername = (username) => ({
  type: RECEIVE_BY_USERNAME,
  username,
});

export const clearUser = (user) => ({
  type: CLEAR_USER,
  user,
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

export const fetchByUsername = (username) => async (dispatch) => {
  try {
    const res = await jwtFetch(`/api/users/search/${username}`);
    const user = await res.json();
    dispatch(receiveByUsername(user));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};

const initialState = {
  user: undefined,
  friends: [],
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_USER_FRIENDS:
      return { ...state, friends: action.friends };
    case RECEIVE_BY_USERNAME:
      return { ...state, user: action.username };
    case CLEAR_USER:
      return { ...state, user: undefined };
    default:
      return state;
  }
};

export default usersReducer;
