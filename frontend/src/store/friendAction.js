import jwtFetch from "./jwt";
const RECEIVE_FRIEND_ERRORS = "friend/RECEIVE_FRIEND_ERRORS";

const receiveErrors = (errors) => ({
  type: RECEIVE_FRIEND_ERRORS,
  errors,
});

export const addUserFriends = (userId) => {
  return { type: "ADD_FRIENDS", userId };
};

export const updateFriendStatus = (friendId, isFriend) => {
  return { type: "UPDATE_FRIEND_STATUS", friendId, isFriend };
};

export const fetchFriends = (userId) => async (dispatch) => {
  try {
    const res = await jwtFetch(`/api/users/${userId}/friends`);
    const friends = await res.json();
    dispatch(addUserFriends(friends));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const addFriend = (friendId, userId) => async (dispatch) => {
  try {
    await jwtFetch(`/api/friends/${friendId}`, {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
      }),
    });
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const removeFriend = (friendId, userId) => async (dispatch) => {
  try {
    await jwtFetch(`/api/friends/${friendId}/${userId}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.log(err);
  }
};
