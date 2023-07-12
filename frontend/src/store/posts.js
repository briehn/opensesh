import jwtFetch from "./jwt";
import { RECEIVE_USER_LOGOUT } from "./session";

const RECEIVE_POSTS = "posts/RECEIVE_POSTS";
const RECEIVE_NEW_POST = "posts/RECEIVE_NEW_POST";
const RECEIVE_UPDATED_POST = "posts/RECEIVE_UPDATED_POST";
const RECEIVE_POST_ERRORS = "posts/RECEIVE_POST_ERRORS";
const CLEAR_POST_ERRORS = "posts/CLEAR_POST_ERRORS";
const CLEAR_POSTS = "posts/CLEAR_POSTS";
const RECEIVE_POST = "posts/RECEIVE_POST";

const receivePosts = (posts) => ({
  type: RECEIVE_POSTS,
  posts,
});

const receivePost = (post) => ({
  //unused
  type: RECEIVE_POST,
  post,
});

const receiveUpdatedPost = (post) => ({
  type: RECEIVE_UPDATED_POST,
  post,
});

const receiveNewPost = (post) => ({
  type: RECEIVE_NEW_POST,
  post,
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

export const updatePost = (postId) => async (dispatch) => {
  try {
    const res = await jwtFetch(`/api/posts/${postId}`);
    const post = await res.json();
    dispatch(receiveUpdatedPost(post));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const fetchPosts =
  (
    type,
    userId = 0, //default value in the case typeId = 0
    filter = ""
    //add filter param
  ) =>
  async (dispatch) => {
    /*  TYPES
        0: ALL
        1: USER
        2: FRIENDS
        3: SPECIFIC
    */
    const types = {
      all: `/api/posts`,
      user: `/api/posts/user/${userId}`,
      friend: `/api/posts/user/${userId}/friends`,
      one: `/api/posts/${userId}/`,
    };
    let url = types[type];
    if (filter.length > 0) {
      url += `?filter=${encodeURIComponent(filter)}`;
    }
    try {
      const res = await jwtFetch(url);
      const posts = await res.json();
      dispatch(receivePosts(posts));
    } catch (err) {
      const resBody = await err.json();
      if (resBody.statusCode === 400) {
        dispatch(receiveErrors(resBody.errors));
      }
    }
  };

export const addLikes = (postId) => async (dispatch) => {
  try {
    await jwtFetch(`/api/posts/${postId}/likes`, {
      method: "POST",
    });
    const fetch = await jwtFetch(`/api/posts/${postId}`);
    const post = await fetch.json();
    dispatch(receivePost(post));
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
    const fetch = await jwtFetch(`/api/posts/${postId}`);
    const post = await fetch.json();
    dispatch(receivePost(post));
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

const postsReducer = (state = { display: {} }, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return { ...state, display: action.posts };
    case RECEIVE_POST:
      const idx = state.display.findIndex(
        (post) => post._id === action.post._id
      );
      const updatedDisplay = [...state.display];
      updatedDisplay[idx] = action.post;

      return {
        ...state,
        display: updatedDisplay,
      };
    case CLEAR_POSTS:
      return { ...state, display: {} };
    case RECEIVE_USER_LOGOUT:
      return { ...state, display: {} };
    default:
      return state;
  }
};

export default postsReducer;
