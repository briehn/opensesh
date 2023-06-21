import jwtFetch from "./jwt";

export const addFriend = (friendId) => async (dispatch) => {
  try {
    const res = await jwtFetch(`/api/friends/${friendId}`, {
      method: "POST",
    });
    const newFriend = await res.json();
    dispatch(addFriend);
  } catch (err) {
    console.log(err);
  }
};

export const removeFriend = (friendId) => async (dispatch) => {
  try {
    const res = await jwtFetch(`/api/friends/${friendId}`, {
      method: "DELETE",
    });
    dispatch(removeFriend(friendId));
  } catch (err) {
    console.log(err);
  }
};
