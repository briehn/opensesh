import jwtFetch from "./jwt";
import { fetchFriends } from "./users";
const RECEIVE_FRIEND_ERRORS = "friend/RECEIVE_FRIEND_ERRORS";

const receiveErrors = (errors) => ({
  type: RECEIVE_FRIEND_ERRORS,
  errors,
});

export const addFriend = (friendId, userId) => async (dispatch) => {
  try {
    const res = await jwtFetch(`/api/friends/${friendId}`, {
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

export const removeFriend = (friendId) => async (dispatch) => {
  try {
    const res = await jwtFetch(`/api/friends/${friendId}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.log(err);
  }
};
