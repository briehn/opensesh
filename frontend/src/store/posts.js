import jwtFetch from "./jwt";
import { RECEIVE_USER_LOGOUT } from "./session";

const RECEIVE_POSTS = "posts/RECEIVE_POSTS";
const RECEIVE_USER_POSTS = "posts/RECEIVE_USER_POSTS";
const RECEIVE_NEW_POST = "posts/RECEIVE_NEW_POST";
const RECEIVE_UPDATED_POST = "posts/RECEIVE_UPDATED_POST";
const RECEIVE_FRIENDS_POSTS = "posts/RECEIVE_FRIENDS_POSTS";
const RECEIVE_POST_ERRORS = "posts/RECEIVE_POST_ERRORS";
const CLEAR_POST_ERRORS = "posts/CLEAR_POST_ERRORS";
const CLEAR_POSTS = "posts/CLEAR_POSTS";

const receivePosts = (posts) => ({
  type: RECEIVE_POSTS,
  posts,
});

const receiveUserPosts = (posts) => ({
  type: RECEIVE_USER_POSTS,
  posts,
});

const receiveNewPost = (post) => ({
  type: RECEIVE_NEW_POST,
  post,
});

const receiveFriendPost = (posts) => ({
  type: RECEIVE_FRIENDS_POSTS,
  posts,
});

const receiveErrors = (errors) => ({
  type: RECEIVE_POST_ERRORS,
  errors,
});

export const clearPosts = (posts) => ({
  type: CLEAR_POSTS,
  posts,
});
export const clearPostErrors = (errors) => ({
  type: CLEAR_POST_ERRORS,
  errors,
});

export const fetchPosts = () => async (dispatch) => {
  try {
    const res = await jwtFetch("/api/posts");
    const posts = await res.json();
    dispatch(receivePosts(posts));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const fetchFriendPosts = (id) => async (dispatch) => {
  try {
    const res = await jwtFetch(`/api/posts/user/${id}/friends`);
    const posts = await res.json();
    dispatch(receiveFriendPost(posts));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const fetchUserPosts = (id) => async (dispatch) => {
  try {
    const res = await jwtFetch(`/api/posts/user/${id}`);
    const posts = await res.json();
    dispatch(receiveUserPosts(posts));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const addLikes = (postId) => async (dispatch) => {
  try {
    await jwtFetch(`/api/posts/${postId}/likes`, {
      method: "POST",
    });
    const fetch = await jwtFetch("/api/posts");
    const posts = await fetch.json();
    dispatch(receivePosts(posts));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const removeLikes = (postId) => async (dispatch) => {
  try {
    await jwtFetch(`/api/posts/${postId}/likes`, {
      method: "DELETE",
    });
    const fetch = await jwtFetch("/api/posts");
    const posts = await fetch.json();
    dispatch(receivePosts(posts));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const composePost = (data) => async (dispatch) => {
  try {
    const res = await jwtFetch("/api/posts/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const post = await res.json();
    dispatch(receiveNewPost(post));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

const nullErrors = null;

export const postErrorsReducer = (state = nullErrors, action) => {
  switch (action.type) {
    case RECEIVE_POST_ERRORS:
      return action.errors;
    case RECEIVE_NEW_POST:
    case CLEAR_POST_ERRORS:
      return nullErrors;
    default:
      return state;
  }
};

const postsReducer = (
  state = { all: {}, friends: {}, user: {}, new: undefined },
  action
) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return { ...state, all: action.posts, new: undefined };
    case RECEIVE_FRIENDS_POSTS:
      return { ...state, friends: action.posts, new: undefined };
    case RECEIVE_USER_POSTS:
      return { ...state, user: action.posts, new: undefined };
    case CLEAR_POSTS:
      return { ...state, all: {}, user: {}, new: undefined };
    case RECEIVE_USER_LOGOUT:
      return { ...state, user: {}, new: undefined };
    default:
      return state;
  }
};

export default postsReducer;
