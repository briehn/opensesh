import jwtFetch from "./jwt";

const RECEIVE_PROMPT = "prompt/RECEIVE_PROMPT";

const initialState = {
  prompt: "",
};

export const receivePrompt = (prompt) => ({
  type: RECEIVE_PROMPT,
  prompt,
});

export const fetchRandomPrompt = () => async (dispatch) => {
  try {
    const response = await jwtFetch("/api/prompt/random-prompt");
    const { prompt } = response.data;
    dispatch(receivePrompt(prompt));
  } catch (error) {
    console.error("Error:", error);
  }
};

const promptReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_PROMPT:
      return {
        ...state,
        prompt: action.prompt,
      };
    default:
      return state;
  }
};

export default promptReducer;
